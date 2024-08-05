import requests
#get company object using company name, get the company ticker and replace it with the actual ticker - use fstring
# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
url = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=WBBW&apikey=QO74GE9362PLVHDU'
#WBBW is a good example
# url = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=SYHO&apikey=QO74GE9362PLVHDU'
r = requests.get(url)
data = r.json()

print(data)