from msci_esg.ratefinder import ESGRateFinder

# Create an ESGRateFinder object, optionally passing in debug=True for more print statements
ratefinder = ESGRateFinder()

# Call the ratefinder object's get_esg_rating method, passing in the Apple stock symbol and 
# a JS timeout of 5 seconds (this is how long the Selenium web driver should wait for JS to execute 
# before scraping content)
response = ratefinder.get_esg_rating(
    symbol="TSLA",
    js_timeout=5
)
# The response is a dictionary; print it
print(response)
# Will look like: 
# {'rating-paragraph': 'Tesla is average among 40 companies in the automobiles industry.', 'rating-history-paragraph': "Tesla's rating remains unchanged since April, 2019.", 'current': {'esg_rating': 'a', 'esg_category': 'average'}, 'history': {'jul-17': 'aaa', 'apr-18': 'aa', 'aug-18': 'aa', 'apr-19': 'a', 'apr-20': 'a'}}
