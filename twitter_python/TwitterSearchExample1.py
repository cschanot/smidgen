from TwitterSearch import *
import json
try:
        tso = TwitterSearchOrder() # create a TwitterSearchOrder object
        tso.set_keywords(['Guttenberg', 'Doktorarbeit']) # let's define all words we would like to have a look for
        tso.set_language('de') # we want to see German tweets only
        tso.set_include_entities(False) # and don't give us all those entity information

        # it's about time to create a TwitterSearch object with our secret tokens
        ts = TwitterSearch(
            consumer_key = 'gYjLgRU2gyjuBYs5u4hKTXk26',
            consumer_secret = '5ivuMrlBAdU3gEtGcyp5IthwnSNkxCAE1M9Pt4BRrQfkP77fcW',
            access_token = '377991139-3eb2B4L0CSnoPoeeyMF98t8p3XyyBYVFLvRIxI1a',
            access_token_secret = 'zBQg7SB36mHkdU5Z820y3DDqiAmp2SsLOndmHh5jYFm0M'
            )
        #ouput array
        aDict = []
        # this is where the fun actually starts :)
        for tweet in ts.search_tweets_iterable(tso):
               aDict.append( '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] ) )

        #json stuff
        jsonString = json.dumps(aDict)
        jsonFile = open("output.json", "w")
        jsonFile.write(jsonString)
        jsonFile.close()

except TwitterSearchException as e: # take care of all those ugly errors if there are some
        print(e)