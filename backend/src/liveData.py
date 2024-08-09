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