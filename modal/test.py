import requests

# Define the endpoint URL
url = "https://baseballwalkerchris--example-sgl-vlm-model-generate-dev.modal.run"  # Replace with your actual endpoint URL

# Define the payload with image_url and question (optional)
payload = {
    "image_url": "/Users/christophercheng/Desktop/Projects/HackMIT/mit-hack-image-to-music/convex/test.py",  # Optional, replace with a valid URL
    "question": "What is in this image?"        # Optional, replace with your question
}

# Make the POST request
response = requests.post(url, json=payload)

# Check the response status
if response.status_code == 200:
    # Process the response
    print("Success! Here is the response:")
    print(response.json())  # Assuming the response is in JSON format
else:
    print(f"Error: Received status code {response.status_code}")
    print(response.text)