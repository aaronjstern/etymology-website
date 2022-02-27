import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from time import sleep
from pymongo import MongoClient
from selenium.common.exceptions import NoSuchElementException

more_pages = True
page = 1
blog_links = []
while more_pages:
    response = requests.get(f"https://blog.oup.com/category/oxford_etymologist/page/{page}")
    if response.status_code != 200:
        more_pages = False
        break
    soup = BeautifulSoup(response.text, "html.parser")
    blogs = soup.select(".read-more")
    for blog in blogs:
        blog_links.append(blog.get('href'))
    page += 1


chrome_driver_path = "/Users/aaron/Desktop/pythonPortfolio/jobScrapping/chromedriver"
driver = webdriver.Chrome(executable_path=chrome_driver_path)

client = MongoClient()

db = client.etymology
collection = db.collection

for link in blog_links:
    driver.get(link)
    try:
        title = driver.find_element_by_css_selector("h1").text
        em_tags = driver.find_elements_by_css_selector("div.article__the-content>p>em")
    except NoSuchElementException:
        continue
    else:
        words = [word.text for word in em_tags]
        blog_post = {
            "Link": link,
            "Title": title,
            "Words": words
        }
        collection.insert_one(blog_post)




