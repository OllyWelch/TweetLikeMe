# Tweet Like Me

A simple Flask app consisting which generates tweets from any given user.
The app consists of an API, which performs the following functions: 

- api/get_tweets/username: Gets tweets from a user given their username
- api/get_profile_image/username: Gets the profile image of a user given their username
- api/generate_tweet: Given a corpus of tweets given in a post request, generates new tweets

Combining these functions gives the entire app functionality. 
The first two API endpoints use the library snscrape to scrape the required data, while the third uses the library markovify to generate short sentences. 
