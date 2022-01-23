from flask import Flask, render_template, request, jsonify
from json2html import *
import configparser
import requests
import json
import os
import datetime

# To set your environment variables in your terminal run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = "AAAAAAAAAAAAAAAAAAAAABmiUgEAAAAA6h2vLrTsUWElFlXE1cutt7stObk%3DDUaoRcksG7VjubGkvCYk01BT16sV0IhmneaXqG0VaO1wOhgAIq"

search_url = "https://api.twitter.com/2/tweets/search/all"

# Optional params: start_time,end_time,since_id,until_id,max_results,next_token,
# expansions,tweet.fields,media.fields,poll.fields,place.fields,user.fields
# https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet

# See here for example queries: https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query
# Full archine search: https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/full-archive-search

# Example query parameters, note: expansions with author_id is REQUIRED to use user.fields.
# query_params = {'query': 'test place_country:US -birthday -is:retweet',
#        'tweet.fields': 'public_metrics,created_at,lang,author_id,source',
#        'expansions': 'author_id',
#        'user.fields': 'name,username,verified,location'}


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


app = Flask(__name__)


@app.route('/', methods=["GET", "POST"])
def index():
    #query_params={'query': 'test place_country:US -birthday -is:retweet'}
    if request.method == "POST":
        # getting input with name = fname in HTML form
        tweet = request.form.get("tweet")
        #query_params={'query': '%s place_country:US -birthday -is:retweet' % tweet}
        query_params = {'query': '%s place_country:US -birthday -is:retweet' % tweet,
                        'tweet.fields': 'public_metrics,created_at,lang,source',
                        'expansions': 'author_id',
                        'user.fields': 'name,username,location'}
        json_response = connect_to_endpoint(search_url, query_params)
        html_table = json2html.convert(
            json_response, table_attributes="id=\"info-table\" class=\"table table-bordered table-hover\"")
        #html_json = json2html.convert(json_response)
        json_deserialize = json.dumps(json_response, indent=1)

    return render_template('index.html', json=html_table, origJson=json_deserialize)


@app.route('/test', methods=["GET", "POST"])
def test():
    query_params = {'query': 'test place_country:US -birthday -is:retweet'}
    if request.method == "POST":
        # getting input with name = fname in HTML form
        tweet = request.form.get("tweet")
        #query_params={'query': '%s place_country:US -birthday -is:retweet' % tweet}
        query_params = {'query': '%s place_country:US -birthday -is:retweet' % tweet,
                        'tweet.fields': 'public_metrics,created_at,lang,source',
                        'expansions': 'author_id',
                        'user.fields': 'name,username,location'}

    json_response = connect_to_endpoint(search_url, query_params)
    html_table = json2html.convert(
        json_response, table_attributes="id=\"info-table\" class=\"table table-bordered table-hover\"")
    #html_json = json2html.convert(json_response)
    json_deserialize = json.dumps(json_response, indent=1)
    # return render_template('test.html',json=html_table,stringify=html_json,origJson=orig_json)

    return render_template('test.html', json=html_table, origJson=json_deserialize)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6970, debug=True)
