import os
import time
import warnings
from uuid import uuid4

import modal
import requests

GPU_TYPE = os.environ.get("GPU_TYPE", "a10g")
GPU_COUNT = os.environ.get("GPU_COUNT", 1)

GPU_CONFIG = f"{GPU_TYPE}:{GPU_COUNT}"

SGL_LOG_LEVEL = "error"  # try "debug" or "info" if you have issues

MINUTES = 60  # seconds

MODEL_PATH = "lmms-lab/llama3-llava-next-8b"
MODEL_REVISION = "e7e6a9fd5fd75d44b32987cba51c123338edbede"
TOKENIZER_PATH = "lmms-lab/llama3-llava-next-8b-tokenizer"
MODEL_CHAT_TEMPLATE = "llama-3-instruct"

def download_model_to_image():
    import transformers
    from huggingface_hub import snapshot_download

    snapshot_download(
        MODEL_PATH,
        revision=MODEL_REVISION,
        ignore_patterns=["*.pt", "*.bin"],
    )

    # otherwise, this happens on first inference
    transformers.utils.move_cache()

vlm_image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(  # add sglang and some Python dependencies
        "sglang[all]==0.1.17",
        "transformers==4.40.2",
        "numpy<2",
    )
    .run_function(  # download the model by running a Python function
        download_model_to_image
    )
    .pip_install(  # add an optional extra that renders images in the terminal
        "term-image==0.7.1"
    )
)

app = modal.App("example-sgl-vlm")


@app.cls(
    gpu=GPU_CONFIG,
    timeout=20 * MINUTES,
    container_idle_timeout=20 * MINUTES,
    allow_concurrent_inputs=100,
    image=vlm_image,
    keep_warm=1
)
class Model:
    @modal.enter()  # what should a container do after it starts but before it gets input?
    def start_runtime(self):
        """Starts an SGL runtime to execute inference."""
        import sglang as sgl

        self.runtime = sgl.Runtime(
            model_path=MODEL_PATH,
            tokenizer_path=TOKENIZER_PATH,
            tp_size=GPU_COUNT,  # t_ensor p_arallel size, number of GPUs to split the model over
            log_level=SGL_LOG_LEVEL,
        )
        self.runtime.endpoint.chat_template = (
            sgl.lang.chat_template.get_chat_template(MODEL_CHAT_TEMPLATE)
        )
        sgl.set_default_backend(self.runtime)

    @modal.web_endpoint(method="POST", docs=True)
    def generate(self, request: dict):
        import sglang as sgl
        from term_image.image import from_file

        start = time.monotonic_ns()
        request_id = uuid4()
        print(f"Generating response to request {request_id}")

        image_url = request.get("image_url")
        if image_url is None:
            image_url = "https://modal-public-assets.s3.amazonaws.com/golden-gate-bridge.jpg"

        image_filename = image_url.split("/")[-1]
        image_path = f"/tmp/{uuid4()}-{image_filename}"
        response = requests.get(image_url)

        response.raise_for_status()

        with open(image_path, "wb") as file:
            file.write(response.content)

        @sgl.function
        def image_qa(s, image_path, question):
            s += sgl.user(sgl.image(image_path) + question)
            s += sgl.assistant(sgl.gen("answer"))

        question = request.get("question")
        if question is None:
            question = "What is this?"

        state = image_qa.run(
            image_path=image_path, question=question, max_new_tokens=128
        )
        # show the question, image, and response in the terminal for demonstration purposes
        print(
            Colors.BOLD, Colors.GRAY, "Question: ", question, Colors.END, sep=""
        )
        terminal_image = from_file(image_path)
        terminal_image.draw()
        answer = state["answer"]
        print(
            Colors.BOLD,
            Colors.GREEN,
            f"Answer: {answer}",
            Colors.END,
            sep="",
        )
        print(
            f"request {request_id} completed in {round((time.monotonic_ns() - start) / 1e9, 2)} seconds"
        )
        
        return answer

warnings.filterwarnings(  # filter warning from the terminal image library
    "ignore",
    message="It seems this process is not running within a terminal. Hence, some features will behave differently or be disabled.",
    category=UserWarning,
)


class Colors:
    """ANSI color codes"""

    GREEN = "\033[0;32m"
    BLUE = "\033[0;34m"
    GRAY = "\033[0;90m"
    BOLD = "\033[1m"
    END = "\033[0m"


    @modal.exit()  # what should a container do before it shuts down?
    def shutdown_runtime(self):
        self.runtime.shutdown()


