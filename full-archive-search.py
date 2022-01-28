import requests
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter

nltk.download('stopwords')
nltk.download('word_tokenize')
nltk.download('punkt')

print(stopwords.words('english'))

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
query_params = {'query': 'bacon place_country:US -birthday -is:retweet',
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

def connect_to_endpoint(url, params):
    response = requests.request(
        "GET", search_url, auth=bearer_oauth, params=params)
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return response.json()

# Strip symbols.
def strip_symbols(str):
    # Characters to replace
    for char in '-.,"[{()}];=+`~_<>/\|@:#?!':
        str=str.replace(char,'')
    # Unable to strip ' with the above since that is what is enclosing everything else, done separately here.
    str=str.replace("'",'')
    return str

def main():
    json_response = connect_to_endpoint(search_url, query_params)

    # Example of printing nested dictionary key-value pairs.
    count = 1
    tweet_ids = {"ID":[]}
    tweet_text = {"Text":[]}

    # Saving Tweet ID's + Tweet text.
    for i in json_response['data']:
        #print("id (%s):" %count, i['id'])
        #print("text (%s):" %count, i['text'])
        tweet_ids['ID'].append(i['id'])
        tweet_text['Text'].append(i['text'])
    
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
    tweet_text_string = json.dumps(tweet_text)
    # Strip first 8 characters, they will always be '{"Text":' which is just the original JSON label
    tweet_text_string = tweet_text_string[8:]
    # Strip tweet text of symbols.
    tweet_text_string = strip_symbols(tweet_text_string)
    # Strip stop words.
    tweet_text_string = nltk_filter(tweet_text_string)

    print("\n\nFormatted tweet text:",*tweet_text_string)

    # Save top 15 words.
    word_count = Counter(tweet_text_string).most_common(15)
    # Print top 15 words.
    print("\n------- Word Count -------",*word_count, sep="\n")

    #print(tweet_ids)
    #print("\nTweet Text Original: ",tweet_text_string)
    #print(word_count(tweet_text_string))
    
    #print(tweet_text_string)
    #print(Counter(tweet_text_string).most_common())
    #print(tweet_text)

if __name__ == "__main__":
    main()
