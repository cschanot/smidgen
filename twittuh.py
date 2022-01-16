import configparser
import requests
import json

from requests_oauthlib import OAuth2Session
import json
import configparser

config = configparser.ConfigParser()
config.read("c:/twitter/config.ini")

# To set your enviornment variables in your terminal run the following line:
# export 'CONSUMER_KEY'='<your_consumer_key>'
# export 'CONSUMER_SECRET'='<your_consumer_secret>'

consumer_key = config['API_Settings']['consumer_key']
consumer_secret =  config['API_Settings']['consumer_secret']
access_token = config['API_Settings']['access_token']
access_token_secret = config['API_Settings']['access_token_secret']



# You can adjust ids to include a single Tweets
# Or you can add to up to 100 comma-separated IDs
params = {"ids": "1278747501642657792"}
# Tweet fields are adjustable.
# Options include:
# attachments, author_id, context_annotations,
# conversation_id, created_at, entities, geo, id,
# in_reply_to_user_id, lang, non_public_metrics, organic_metrics,
# possibly_sensitive, promoted_metrics, public_metrics, referenced_tweets,
# source, text, and withheld

request_token_url = "https://api.twitter.com/oauth/request_token"
oauth = OAuth2Session(consumer_key, client_secret=consumer_secret)

try:
    fetch_response = oauth.fetch_request_token(request_token_url)
except ValueError:
    print(
        "There may have been an issue with the consumer_key or consumer_secret you entered."
    )

resource_owner_key = fetch_response.get("oauth_token")
resource_owner_secret = fetch_response.get("oauth_token_secret")


# oauth_tokens = oauth.fetch_access_token(access_token_url)


# access_token = oauth_tokens["oauth_token"]
# access_token_secret = oauth_tokens["oauth_token_secret"]

# Make the request
oauth = OAuth1Session(
    consumer_key,
    client_secret=consumer_secret,
    resource_owner_key=access_token,
    resource_owner_secret=access_token_secret,
)

response = oauth.get(
    "https://api.twitter.com/2/tweets/search/all", params=params
)

if response.status_code != 200:
    raise Exception(
        "Request returned an error: {} {}".format(response.status_code, response.text)
    )

print("Response code: {}".format(response.status_code))
json_response = response.json()
print(json.dumps(json_response, indent=4, sort_keys=True))
