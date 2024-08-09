from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests
from typing import List, Dict

def access_articles(URL: str) -> List[Dict[str, str]]:
    page = requests.get(URL)
    if page.status_code == 200:
        soup = BeautifulSoup(page.content, "html.parser")
        articles = []
        results = soup.find_all('div', class_='text-component')

        for article in results:
            title_exists = article.find('h3')
            link_exists = article.find('a')

            if title_exists and link_exists:
                title = title_exists.text.strip()
                link = urljoin(URL, link_exists['href'].strip())
                if link.startswith("https://"):
                    link_page = requests.get(link)
                    if link_page.status_code == 404:
                        continue
                    articles.append({'title': title, 'link': link})

    return articles