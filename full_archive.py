import sys
from pickle import FALSE
from json2html import *
import requests
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import string
import spacy
import time

#import os
#import datetime
#import configparser

nlptweet = spacy.load("en_core_web_sm")

nltk.download('stopwords')
nltk.download('word_tokenize')
nltk.download('punkt')

#print(stopwords.words('english'))

# To set your environment variables in your terminal run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = "AAAAAAAAAAAAAAAAAAAAABmiUgEAAAAA6h2vLrTsUWElFlXE1cutt7stObk%3DDUaoRcksG7VjubGkvCYk01BT16sV0IhmneaXqG0VaO1wOhgAIq"
#bearer_token = "AAAAAAAAAAAAAAAAAAAAAM6jYAEAAAAAzE7k%2Ba6IK623MI3ZgV6LqQM%2BUrc%3DgMkuLLmpagzzj5kUb6umPGwVvMZvhwrAWXmLxYDxZvChRF16K8"
search_url = "https://api.twitter.com/2/tweets/search/all"
example_query = "school"
example_query_array = ["school", "bacon", "time"]

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

# nltk filter testing
def nltk_filter(str):
    # Lowercase to match filter words.
    str = str.lower()
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(str)
    
    filtered_sentence = [w for w in word_tokens if not w.lower() in stop_words]
    filtered_sentence = []
    
    for w in word_tokens:
        if w not in stop_words:
            filtered_sentence.append(w)
    
    #print(word_tokens)
    #print(filtered_sentence)
    return filtered_sentence

# Strip symbols.
def strip_symbols(str):
    # The below manual approach also works, and is a bit more customizable.
    # for char in '-.,"[{()}];=+`~_<>\|#@!:?':
    #str=str.replace("'",'')

    # New line (\n) are being reduced to (n), therefore we remove any \n before removing symbols/punctuation.
    str = str.replace("\\n", "")
    # Removing &amp; explicitly, as I dont want to filter the word "amp".
    str = str.replace("&amp;", "")
    # Unicode symbol " ’ " was not being removed by built in string.punctuation.
    str = str.replace("’", "")

    # Characters to replace
    for char in string.punctuation:
        str=str.replace(char,'')
    return str


# Single-Query function || String input.
def single_query(query):

    # Initialize Variables
    count = 1
    tweet_ids = {"ID":[]}
    tweet_text = {"Text":[]}
    print(query)

    # If the query isn't empty, run the query.
    if (query):
        query_params = {'query': '%s place_country:US -birthday -is:retweet' % query,
                        'tweet.fields': 'public_metrics,created_at,lang,source',
                        'expansions': 'author_id',
                        'user.fields': 'name,username,location'}
        json_response = connect_to_endpoint(search_url, query_params)

        # Example of printing nested dictionary key-value pairs.
        #count = 1
        #tweet_ids = {"ID":[]}
        #tweet_text = {"Text":[]}
        #nlp_dict = { 0: {'text': '', 'noun_phrases': '', 'verbs': '', 'entities': ''}}
        # Testing json_response output when query results in no hits.
        #print(json_response)

        if(json_response['meta']['result_count'] != 0):
            # Saving Tweet ID's + Tweet text.
            for i in json_response['data']:
                #print("id (%s):" %count, i['id'])
                #print("text (%s):" %count, i['text'])
                tweet_ids['ID'].append(i['id'])
                tweet_text['Text'].append(i['text'])
            print("Tweet Text Original: ", tweet_text)

            print("\n------- Tweet IDs -------")
            for i in tweet_ids['ID']:
                print("Tweet ID (%s):" %count,i)
                count += 1
            count = 1

            print("\n------- Tweet Text -------")
            for i in tweet_text['Text']:
                print("Tweet text (%s):" %count,i)
                count += 1

            #print(tweet_text['Text'])

            # Convert tweet text from JSON to String format.
            # ensure_ascii=False leaves unicode as is - otherwise there is escaped unicode in the output, for example "u2019" for the symbol: ’
            tweet_text_string = json.dumps(tweet_text,ensure_ascii=False)
            # Strip first 8 characters, they will always be '{"Text":' which is just the original JSON label
            tweet_text_string = tweet_text_string[8:]
            # Strip tweet text of symbols.
            tweet_text_string = strip_symbols(tweet_text_string)
            # Strip stop words.
            tweet_text_string = nltk_filter(tweet_text_string)

            print("\n\nFormatted tweet text:",*tweet_text_string)

            # Save top 15 words.
            word_count = Counter(tweet_text_string).most_common(15)
            #print(type(word_count))
            # Print top 15 words.
            print("\n------- Word Count (Top %s) for %s -------" %(len(word_count), query_params['query'].split()[0]),*word_count, sep="\n")
        else:
            print("No results for %s" %query_params['query'].split()[0])
            return FALSE


# Multi-Query function || Input will need to be an array.
def multi_query(query_params):
    tweet_array = query_params
    print("TWEET ARRAY: ", tweet_array)

    # Initialize multi-query twitter response array.
    json_responsez = []

    # Variables
    count = 1
    tweet_ids = {"ID":[]}
    tweet_text = {"Text":[]}

    # If tweet_array exists (multi-query) continue
    if len(tweet_array) > 0:
        for tz in range(len(tweet_array)):
            #json_responsez = []
            query_params = {'query': '%s place_country:US -birthday -is:retweet' % tweet_array[tz],
                    'tweet.fields': 'public_metrics,created_at,lang,source',
                    'expansions': 'author_id',
                    'user.fields': 'name,username,location'}
            print(query_params)
            json_responsez.append(connect_to_endpoint(search_url, query_params))
            # Required - Full-archive has a 1 request / 1 second limit
            time.sleep(1.5)
        #print(json_responsez)
        for x in range(len(json_responsez)): 
            if(json_responsez[x]['meta']['result_count'] != 0):
                # Saving Tweet ID's + Tweet text.
                for i in json_responsez[x]['data']:
                    #print("id (%s):" %count, i['id'])
                    #print("text (%s):" %count, i['text'])
                    tweet_ids['ID'].append(i['id'])
                    tweet_text['Text'].append(i['text'])
                print("Tweet Text Original: ", tweet_text)

                print("\n------- Tweet IDs -------")
                for i in tweet_ids['ID']:
                    print("Tweet ID (%s):" %count,i)
                    count += 1
                count = 1

                print("\n------- Tweet Text -------")
                for i in tweet_text['Text']:
                    print("Tweet text (%s):" %count,i)
                    count += 1

                # Convert tweet text from JSON to String format.
                # ensure_ascii=False leaves unicode as is - otherwise there is escaped unicode in the output, for example "u2019" for the symbol: ’
                tweet_text_string = json.dumps(tweet_text,ensure_ascii=False)
                # Strip first 8 characters, they will always be '{"Text":' which is just the original JSON label
                tweet_text_string = tweet_text_string[8:]
                # Strip tweet text of symbols.
                tweet_text_string = strip_symbols(tweet_text_string)
                # Strip stop words.
                tweet_text_string = nltk_filter(tweet_text_string)

                print("\n\nFormatted tweet text:",*tweet_text_string)

                # Save top 15 words.
                word_count = Counter(tweet_text_string).most_common(15)
                #print(type(word_count))
                # Print top 15 words.
                #print("\n------- Word Count (Top %s) for %s -------" %(len(word_count), query_params['query'].split()[0]),*word_count, sep="\n")

    # Top word output of combined arrays.
    print("\n------- Word Count (Top %s) for %s -------" %(len(word_count), query_params['query'].split()[0]),*word_count, sep="\n")

# Function Testing\
if len(sys.argv) > 1:
    if sys.argv[1] == 'S':
        single_query(sys.argv[2])
    if sys.argv[1] == 'M':
        multi_query(sys.argv[2])
