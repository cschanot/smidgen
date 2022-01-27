import requests
import json

# To set your environment variables in your terminal run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = "AAAAAAAAAAAAAAAAAAAAABmiUgEAAAAA6h2vLrTsUWElFlXE1cutt7stObk%3DDUaoRcksG7VjubGkvCYk01BT16sV0IhmneaXqG0VaO1wOhgAIq"

search_url = "https://api.twitter.com/2/tweets/search/all"

# Optional params: start_time,end_time,since_id,until_id,max_results,next_token,
# expansions,tweet.fields,media.fields,poll.fields,place.fields,user.fields
# https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet

# See here for example queries: https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query
# Full archine search: https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/full-archive-search
# query_params = {'query': '(from:twitterdev -is:retweet) OR #twitterdev','tweet.fields': 'author_id'}
# query_params = {'query': '(happy OR happiness) place_country:US -birthday -is:retweet'}
# --- tweet.fields valid parameters ---
# attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id, lang,non_public_metrics,
# organic_metrics,possibly_sensitive,promoted_metrics,public_metrics,referenced_tweets,reply_settings,source,text,withheld
query_params = {'query': 'test place_country:US -birthday -is:retweet',
                'tweet.fields': 'public_metrics,created_at,lang,author_id,source',
                'expansions': 'author_id',
                'user.fields': 'name,username,verified,location'}


def bearer_oauth(r):
    """
    Method required by bearer token authentication.
    """

    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2FullArchiveSearchPython"
    return r


def connect_to_endpoint(url, params):
    response = requests.request(
        "GET", search_url, auth=bearer_oauth, params=params)
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return response.json()


def main():
    json_response = connect_to_endpoint(search_url, query_params)

    # Example of printing nested dictionary key-value pairs.
    count = 1
    tweet_ids = []
    print("\nPrinting nested dictionary as a key-value pair:")
    for i in json_response['data']:
        print("id (%s):" %count, i['id'])
        tweet_ids.append(i['id'])
        count += 1
    print("\nResulting Array:",tweet_ids)

if __name__ == "__main__":
    main()
