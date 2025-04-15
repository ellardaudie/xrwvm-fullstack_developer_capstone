# Uncomment the imports below before you add the function code
# import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

import requests

backend_url = "http://localhost:3030"  # or whatever your Node server is using

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params += f"{key}={value}&"
    request_url = backend_url + endpoint + "?" + params

    print(f"GET from {request_url}")  # Debugging the full request URL

    try:
        response = requests.get(request_url)
        response.raise_for_status()  # Will raise an error for bad status codes
        return response.json()
    except requests.RequestException as e:
        print(f"Network exception occurred: {e}")
        return None  # Or return an empty list/dict depending on what you want to handle

# Wrapper functions to interact with the specific endpoints
def fetch_reviews():
    return get_request("/fetchReviews")

def fetch_dealers():


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")

# def post_review(data_dict):
# Add code for posting review
