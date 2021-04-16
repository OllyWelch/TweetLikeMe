from flask import jsonify, request
from app.api import bp
import markovify
import snscrape.modules.twitter as sntwitter

MAX_TWEETS = 2000


@bp.route('/generate_tweet', methods=['POST'])
def generate_tweet():
    # Retrieve request json attributes
    text = str(request.form['text'])

    # Build the model
    text_model = markovify.Text(text, state_size=2)

    return jsonify(text_model.make_short_sentence(280))


@bp.route('/get_tweets/<string:username>')
def get_tweets(username):
    query = 'from:{} -filter:replies -filter:links'.format(username)
    scraper = sntwitter.TwitterSearchScraper(query)
    text = ""
    for i, tweet in enumerate(scraper.get_items()):
        if i > MAX_TWEETS:
            break
        text += tweet.content
        last_letter = tweet.content[-1]
        if last_letter != '.' and last_letter != '?' and last_letter != '!':
            text += '.'
        text += " "
    text = text.replace("\"", "")
    text = text.replace("\n", " ")
    if len(text) == 0:
        return "No tweets found"
    return jsonify(text)


@bp.route('/get_profile_image/<string:username>')
def get_profile_image(username):
    scraper = sntwitter.TwitterUserScraper(username)
    try: 
        url = scraper._get_entity().profileImageUrl
        return url.replace("_normal", "")
    except:
        return "Profile image not found"
