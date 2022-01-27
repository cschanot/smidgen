// Search for public Tweets across the whole Twitter archive
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/full-archive-search

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = "AAAAAAAAAAAAAAAAAAAAABmiUgEAAAAA6h2vLrTsUWElFlXE1cutt7stObk%3DDUaoRcksG7VjubGkvCYk01BT16sV0IhmneaXqG0VaO1wOhgAIq";

const endpointUrl = 'https://api.twitter.com/2/tweets/search/all'

async function getRequest() {

    // These are the parameters for the API request
    // specify Tweet IDs to fetch, and any additional fields that are required
    // by default, only the Tweet ID and text are returned
    const params = {
        'query': 'test place_country:US -birthday -is:retweet',
                'tweet.fields': 'public_metrics,created_at,lang,author_id,source',
                'expansions': 'author_id',
                'user.fields': 'name,username,verified,location'
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2FullArchiveJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        //document.getElementById("jsonString").innerHTML = res.body;
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

(async () => {

    try {
        // Make request
        const response = await getRequest();
        console.dir(response, {
            depth: null
        });

    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
})();