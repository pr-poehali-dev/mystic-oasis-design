"""Парсит новости агро-сектора России с сайта vesti365.ru и возвращает список статей."""

import json
import urllib.request
from html.parser import HTMLParser


class NewsParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.news = []
        self._in_item = False
        self._in_title = False
        self._in_link = False
        self._in_pubdate = False
        self._in_description = False
        self._current = {}
        self._buffer = ""

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "item":
            self._in_item = True
            self._current = {}
        elif self._in_item:
            if tag == "title":
                self._in_title = True
                self._buffer = ""
            elif tag == "link":
                self._in_link = True
                self._buffer = ""
            elif tag == "pubdate":
                self._in_pubdate = True
                self._buffer = ""
            elif tag == "description":
                self._in_description = True
                self._buffer = ""
            elif tag == "enclosure" and "url" in attrs_dict:
                self._current["image"] = attrs_dict["url"]

    def handle_endtag(self, tag):
        if tag == "item" and self._in_item:
            self._in_item = False
            if self._current.get("title") and self._current.get("link"):
                self.news.append(self._current)
                self._current = {}
        elif self._in_item:
            if tag == "title":
                self._in_title = False
                self._current["title"] = self._buffer.strip()
            elif tag == "link":
                self._in_link = False
                self._current["link"] = self._buffer.strip()
            elif tag == "pubdate":
                self._in_pubdate = False
                self._current["pubdate"] = self._buffer.strip()
            elif tag == "description":
                self._in_description = False

    def handle_data(self, data):
        if self._in_title:
            self._buffer += data
        elif self._in_link:
            self._buffer += data
        elif self._in_pubdate:
            self._buffer += data
        elif self._in_description:
            self._buffer += data


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    rss_url = "https://vesti365.ru/novosti-agro-rossii/feed/"

    req = urllib.request.Request(
        rss_url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; AgroIndexBot/1.0)"},
    )
    with urllib.request.urlopen(req, timeout=10) as response:
        content = response.read().decode("utf-8", errors="replace")

    parser = NewsParser()
    parser.feed(content)

    news = parser.news[:12]

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"news": news}, ensure_ascii=False),
    }
