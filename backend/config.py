from typing import Literal

class Config(object):
    # to get a string like this run:
    # openssl rand -hex 32
    SECRET_KEY = "45aa99285e9155a8b8792a3075c62fbdba8f71a9d921a12bcb8a6e0105f73e5a"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS = 1

    Disclosure = Literal["CALCULATED", "ADJUSTED", "ESTIMATED", "REPORTED", "IMPUTED"]
    Category = Literal["E", "S", "G"]

    chat_prompts = [
      {"role": "system", 
       "content": """The EcoM platform is designed to assist corporations and investors in ESG 
       (Environmental, Social, Governance) reporting and metrics management. The platform aligns with global
       initiatives such as the Paris Agreement, UNEP FI, IFRS, and TCFD, providing tools for
       sustainable investing."""
      }, 
      {"role": "system", 
       "content": """There are 7 official frameworks: IFRS S1 Framework, Paris Agreement Framework, UNEP FI Framework, IFRS S2 Framework, TCFD Framework, TNFD Framework, and APRA-CPG Framework."""
      }, 
      {"role": "system", 
       "content": """The platform stores over 70,000 companies in the database."""
      }, 
      {"role": "system", 
       "content": """The core functionalities in EcoM includes 1. Single Mode Functionality: Users can choose one industry and one company from a database including S&P 500 and ASX 200 companies, like CommBank and Westpac. 2. Comparison Mode Functionality: Allows comparison of multiple companies across various industries. 3. Select Framework Functionality: Users can choose or customize ESG frameworks (e.g., IFRS S1, IFRS S2, TCFD, TNFD, APRA-CPG). 4. Subjective Weighting Functionality: Users can assign weights to categories and metrics and visualize details. 5. Download Report Functionality: Users can download comprehensive ESG reports. 6. Chat Feature Functionality: Integration with ChatGPT API for a chatbot interface."""
      }, 
      {"role": "system", 
       "content": """The innovative functionalities in EcoM includes 1. Favourites List Functionality: Adding companies to your favourites list so you can view it conveniently in the dashboard. 2. Custom Lists Functionality: Creating custom lists for various companies to help with organization optimization. 3. Industry View Functionality: View all companies within an industry, the industry description, and the average score for that industry. 4. Information Page Functionality: View critical ESG information and are directed to reliable external sources."""
      }, 
      {"role": "system", 
       "content": """The difference between company view and industry view is the company view focuses on individual company metrics, while the industry view aggregates data across multiple companies in the same industry."""
      }, 
      {"role": "system", 
       "content": """The Compare view allows you to compare metrics across different companies or industries. It shows predictive data, and you are able to visualize various graphs and metrics here as well."""
      }, 
      {"role": "system", 
       "content": """Customize metrics lets you select and adjust the metrics that are most relevant to your analysis."""
      }, 
      {"role": "system", 
       "content": """A framework in our platform is a structured approach to evaluate and compare different sets of data. You may personalize this data or alternatively use the following official frameworks: IFRS S1 Framework, Paris Agreement Framework, UNEP FI Framework, IFRS S2 Framework, TCFD Framework, TNFD Framework, APRA-CPG Framework."""
      }, 
      {"role": "system", 
       "content": """Lists in our platform help you organize and manage data sets, allowing for easy retrieval and comparison. You can sort various companies into different lists for ease of analysis as well."""
      }, 
      {"role": "system", 
       "content": """To favourite a company, simply go to the company overview page and select LIKE. When you return to your home page, it will appear in favourites."""
      }, 
    ]