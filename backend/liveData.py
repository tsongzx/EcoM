import yfinance as yf


# Example Code
def getCompanyInfo (companyCode):
    company = yf.Ticker(companyCode)
    return company.info

# Returns the Company History in Month/Days
def getCompanyHist (companyCode, time):
    company = yf.Ticker(companyCode)
    hist = company.history(period=time)
    return hist.to_dict()

def getCompanyESG (companyCode):
    company = yf.Ticker(companyCode)
    return company.sustainability

# TODO get rid of all of this5
# msft = yf.Ticker("AMZN")
# f = open("demo.txt", "a")
# f.write(msft.sustainability.to_string())
# f.close()

# print("1 here")
# # get all stock info
# print(msft.info)
# print("2 here")
# # get historical market data
# hist = msft.history(period="1mo")
# print("3 here")
# print(hist)
# # show meta information about the history (requires history() to be called first)
# msft.history_metadata
# print("4 here")
# # show actions (dividends, splits, capital gains)
# msft.actions
# msft.dividends
# msft.splits
# msft.capital_gains  # only for mutual funds & etfs

# # show share count
# msft.get_shares_full(start="2022-01-01", end=None)

# # show financials:
# # - income statement
# msft.income_stmt
# msft.quarterly_income_stmt
# # - balance sheet
# msft.balance_sheet
# msft.quarterly_balance_sheet
# # - cash flow statement
# msft.cashflow
# msft.quarterly_cashflow
# # see `Ticker.get_income_stmt()` for more options

# # show holders
# msft.major_holders
# msft.institutional_holders
# msft.mutualfund_holders
# msft.insider_transactions
# msft.insider_purchases
# msft.insider_roster_holders

# msft.sustainability

# # show recommendations
# msft.recommendations
# msft.recommendations_summary
# msft.upgrades_downgrades

# # Show future and historic earnings dates, returns at most next 4 quarters and last 8 quarters by default.
# # Note: If more are needed use msft.get_earnings_dates(limit=XX) with increased limit argument.
# msft.earnings_dates

# # show ISIN code - *experimental*
# # ISIN = International Securities Identification Number
# msft.isin

# # show options expirations
# msft.options

# # show news
# msft.news

# # get option chain for specific expiration
# opt = msft.option_chain('YYYY-MM-DD')
# # data available via: opt.calls, opt.puts