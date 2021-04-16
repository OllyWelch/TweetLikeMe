FROM python:3.8-alpine

RUN adduser -D tweetlikeme

WORKDIR /home/tweetlikeme

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN apk add --update --no-cache g++ gcc libxslt-dev
RUN apk add git
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY app app
COPY tweetlikeme.py boot.sh ./
RUN chmod +x boot.sh

ENV FLASK_APP tweetlikeme.py

RUN chown -R tweetlikeme:tweetlikeme ./
USER tweetlikeme

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
