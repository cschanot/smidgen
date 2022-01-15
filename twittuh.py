import configparser
import twitter


config = configparser.ConfigParser()
config.read("c:/twitter/config.ini")
print(config['API_Settings']['consumer_key'])


api = twitter.Api(consumer_key=config['API_Settings']['consumer_key'],
                  consumer_secret=config['API_Settings']['consumer_secret'],
                  access_token_key=config['API_Settings']['access_token'],
                  access_token_secret=config['API_Settings']['access_token_secret'])

                  
