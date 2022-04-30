from flask import Flask, render_template, request, jsonify
import requests
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import string
import time
import ast

nltk.download('stopwords', quiet=True)
#nltk.download('word_tokenize', quiet=True)
nltk.download('punkt', quiet=True)


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
    # for char in '-.,"[{()}];=+`~_<>\|#!:?':
    # str=str.replace("'",'')

    # New line (\n) are being reduced to (n), therefore we remove any \n before removing symbols/punctuation.
    str = str.replace("\\n", "")
    # Removing &amp; explicitly, as I dont want to filter the word "amp".
    str = str.replace("&amp;", "")
    # Unicode symbols ’, ”, “ were not being removed by built in string.punctuation. Add later.
    str = str.replace("’", "")
    str = str.replace("”", "")
    str = str.replace("“", "")

    # Characters to replace
    for char in string.punctuation:
        str=str.replace(char,'')
    return str




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
@app.route('/', methods=["GET","POST"])
def index():
    return render_template('index.html')
@app.route('/twapi', methods=["GET","POST"])
def twapi():
    print(request.form)
    tweet = request.form['tweet']
    print("SOME TWEET: " + tweet)
    #data = json.loads(request.data)
    #data = request.json
    tweet_array = tweet.split(",")

    # ?? Needs a string ?? I was passing a string so not sure whats wrong here.
    # tweet_array = ast.literal_eval(str(query_params))

    # Initialize multi-query twitter response array.
    api_response = []
    no_results = []
    hit_terms = []

    # Variables
    count = 1
    tweet_data = {"ID":[],"Text":[],"Name":[],"Username":[]}
    all_tweet_data = []
    tweet_ids = {"ID":[]}
    tweet_text = {"Text":[]}
    tweet_name = {"Name":[]}
    tweet_username = {"Username":[]}

    # If tweet_array (user search term(s)) exists continue
    if len(tweet_array) > 0:
        for tz in range(len(tweet_array)):
            # API query parameters.
            query_params = {'query': '%s place_country:US -birthday -is:retweet' % tweet_array[tz],
                    'tweet.fields': 'public_metrics,created_at,lang,source',
                    'expansions': 'author_id',
                    'user.fields': 'name,username,location'}
            print("api response: ")

            # Call the twitter API with the given paramaters. Save the result temporarily.
            rescheck = connect_to_endpoint(search_url, query_params)
            #print(rescheck)

            # If the response produced results, append them to an array, otherwise ignore it.
            if(rescheck['meta']['result_count'] != 0):
                api_response.append(rescheck)
                hit_terms.append(tweet_array[tz])
            else:
                no_results.append(tweet_array[tz])
                print("No result for", tweet_array[tz])

            # Required - Full-archive has a 1 request / 1 second limit
            time.sleep(1.5)

            #if(api_response['meta']['result_count'] != 0):
            #    api_response.append(connect_to_endpoint(search_url, query_params))
            #else:
            #    api_response.append("No results for ",tweet_array[tz])
            # Required - Full-archive has a 1 request / 1 second limit
            #time.sleep(1.5)

    if len(api_response) > 0:
        for x in range(len(api_response)):
            # Saving Tweet ID's + Tweet text.
            for i in api_response[x]['data']:
                tweet_ids['ID'].append(i['id'])
                tweet_text['Text'].append(i['text'])
                        # Saving name and username.
            for j in api_response[x]['includes']['users']:
                tweet_name['Name'].append(j['name'])
                tweet_username['Username'].append(j['username'])

            # Convert tweet text from JSON to String format.
            # ensure_ascii=False leaves unicode as is - otherwise there is escaped unicode in the output, for example "u2019" for the symbol: ’
            tweet_text_string = json.dumps(tweet_text,ensure_ascii=False)
            # Strip first 8 characters, they will always be '{"Text":' which is just the original JSON label
            tweet_text_string = tweet_text_string[8:]
            # Strip tweet text of symbols.
            tweet_text_string = strip_symbols(tweet_text_string)
            # Strip stop words.
            tweet_text_string = nltk_filter(tweet_text_string)

            # Save top 15 words.
            word_count = Counter(tweet_text_string).most_common(15)

        # Tweet IDs gathered.
        print("\n------- Tweet IDs -------")
        for i in tweet_ids['ID']:
            print("Tweet ID (%s):" %count,i)
            count += 1
        count = 1
        # Individual tweets gathered.
        print("\n------- Tweet Text -------")
        for i in tweet_text['Text']:
            print("Tweet text (%s):" %count,i)
            count += 1
        count = 1
        # Display name of twitter user.
        print("\n------- Tweet Name -------")
        for i in tweet_name['Name']:
            print("Twitter Name (%s):" %count,i)
            count += 1
        count = 1
        # @Handle of twitter user.
        print("\n------- Tweet Username -------")
        for i in tweet_username['Username']:
            print("Twitter Username (%d):" %count,"@%s"%i)
            count += 1

        # Top word output of combined arrays.
        print("\n------- Word Count (Top %s) for %s -------" %(len(word_count), ' '.join(hit_terms)),*word_count, sep="\n")
        
        # Print the search terms that did not recieve any results from the API
        if(len(no_results) > 0):
            for y in range(len(no_results)):
                print("No results for the following: ", no_results[y])

        # Return all appened responses.
        return json.dumps(api_response)
    # If no results are returned for any query, simply state so.
    else:
        return json.dumps("No results for", ' '.join(no_results))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6970, debug=True)
