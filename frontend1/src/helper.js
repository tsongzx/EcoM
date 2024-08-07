import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get('authToken');
// let indicatorData = null;

// const fetchIndicatorData = async() => {
//     try {
//         const response = await fetch('../backend/db/metrics.json');
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         indicatorData = await response.json();
//         return;
//     } catch (error) {
//         console.error("Unable to fetch data:", error);
//         return null;
//     }
// }

// const initialise = async() => {
//     await fetchIndicatorData();
// }

// initialise();

export const fetchLists = async() => {
    //get the names of all the lists and whether the company is contained inside that list
    //contain that information inside watchlist in the set State
    console.log(`getting the user's lists...`);
    //also return whether the list contains such element
    // console.log(token);
    try {
        const response = await axios.get('http://127.0.0.1:8000/lists', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        console.log('successfully returned lists', response.data.length);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(`error fetching the user's watchlists`, error);
        return [];
    }
}

// Gets 20 companies at a time when the user first goes into the dashboard
export const fetchCompanies = async(search, loadedOptions, { page }) => {
    console.log('Getting all the companies available');
    try {
        const response = await axios.get('http://127.0.0.1:8000/company', 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                },
                params: {
                    page: page,
                    search: search 
                }
            }
        );

        const filteredOptions = response.data
          .map(company => ({
            value: company.id,
            label: company.company_name,
          }));
        
        return {
          options: filteredOptions,
          hasMore: response.data.length >= 20, // there might be more data if we get results
          additional: {
            page: page + 1,
          }
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        return {
          options: [],
          hasMore: false,
        };
      }
}

export const fetchIndustries = async() => {
    const cacheURL = 'http://127.0.0.1:8000/industries';
    try {
        const cache = await caches.open('industries');
        const cachedResponse = await cache.match(cacheURL);
        if (cachedResponse) {
            return await cachedResponse.json();
        }

        const response = await axios.get(cacheURL,
            {headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }});
        
        const responseClone = new Response(JSON.stringify(response.data));
        cache.put(cacheURL, responseClone);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }

    // try {
    //     const response = await axios.get('http://127.0.0.1:8000/industries', 
    //         {
    //             params: {},
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${Cookies.get('authToken')}`
    //             }
    //         }
    //     );
    //     return response.data;
    // } catch (error) {
    //     console.log('Error fetching the companies', error);
    //     return [];
    // }
}


export const getAllCompanies = async() => {
    const cacheURL = 'http://127.0.0.1:8000/company/all';
    try {
        const cache = await caches.open('allCompanies');
        const cachedResponse = await cache.match(cacheURL);
        if (cachedResponse) {
            return await cachedResponse.json();
        }

        const response = await axios.get(cacheURL,
            {headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }});
        
        const responseClone = new Response(JSON.stringify(response.data));
        cache.put(cacheURL, responseClone);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const fetchCompanyInfo = async (companyId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/${companyId}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            } 
        );
        const companyInfo = response.data;
        console.log('fetched company info ', companyInfo);
        return companyInfo;
    } catch (error) {
        console.log('Error fetching company', error);
        return [];
    }
}

export const getCompanyMetrics = async (companyName) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/indicators/${companyName}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }, 
                params: {
                    company_name: companyName
                }
            } 
        );
        const companyInfo = response.data;
        return companyInfo;
    } catch (error) {
        console.log('Error fetching company', error);
        return [];
    }
}


//given a list id, get all the companies that are in that list
export const fetchCompaniesInList = async(listId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/list?list_id=${listId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        console.log(response.data);
        const companyIds = response.data.map(company => company.company_id);
        console.log(`List: ${listId}, companies: ${companyIds}`);
        return companyIds;

    } catch (error) {
        console.log('problem fetching companies in list ', listId, ' ', error);
    }
}

//creates a new Watchlist with name : name
export const createList = async (name) => {
    console.log(`CREATELIST: ${name}, ${typeof name}`);
    //create list
    try {
        const response = await axios.post(`http://127.0.0.1:8000/list?list_name=${name}`,
          {},
          {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        }});
        //if successful
        console.log('successfully added List name: ', name,  ' list id :', response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

//add a company to list id
export const addCompanyToList = async (listId, companyId ) => {
    console.log(`incoming addCompany ${listId}, ${companyId}`);
    try {
        const response = await axios.post('http://127.0.0.1:8000/list/company', {
            list_id: listId,
            company_id: companyId,
        }, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        }});
        //if successfully added
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}

export const removeCompanyFromList = async(listId, companyId) => {
    console.log('deleting CompanyId: ', companyId, 'from LIST: ', listId);
    console.log(Cookies.get('authToken'));
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/list/company?list_id=${listId}&company_id=${companyId}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        }});
        if (response.status === 200) {
            console.log('Successfully removed from list');
        }
    } catch (error) {
        console.log(`Problem removing companyId ${companyId} from list ${listId}, ${error}`);
    }
}

//get watchlists for modal (name and isChecked) This function will run ONLY ONCE at the start of the WatchListModal initialisation
//returns list of JSON objects {id: '', name: '', isChecked: ''}
export const getFormattedUserLists = async (companyId) => {
    //first fetch all the lists the user has
    const lists = await fetchLists();
    if (!Array.isArray(lists)) {
        return [];
    }
    //for each list Id check if the company is in it and append to a list of JSON
    const newList = await Promise.all(lists.map(async(list) => ({
        id: list.id,
        name: list.list_name,
        isChecked: await companyIsInList(list.id, companyId),
    })));
    //returns a list of arrays of the form of a JSOn with list.id, list.checked and list.name
    console.log(newList);
    return newList;
}

//Check whether a company is in a list, returns a boolean
export const companyIsInList = async (listId, companyId) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/list/company', {
            params: {
                list_id: Number(listId),
                company_id: companyId
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//return list of company id
export const getFavouritesList = async() => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/watchlist', 
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
        return response.data;
    } catch (error) {
        console.log(`error getting user's favourites: ${error}`);
    }
}

export const addToFavourites = async(companyId) => {
    console.log(`addin ${companyId} to favourites`);
    try {
        const response = await axios.post(`http://127.0.0.1:8000/watchlist?company_id=${companyId}`, 
          {},  
          {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
        console.log('SUCCESSFULLY added to favourites')
        return response.data;
    } catch (error) {
        console.log(`error adding to favourites: ${error}`);
    }
}

export const deleteFromFavourites = async(companyId) => {
    console.log('deleting from favourites');
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/watchlist?company_id=${companyId}`, 
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
        console.log('SUCCESSFULLY deleted from favourites');
        return response.data;
    } catch (error) {
        console.log(`error deleting from favourites: ${error}`);
    }
}


//return list of recently viewed
export const getRecentlyViewed = async() => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/recently_viewed', 
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
        return response.data;
    } catch (error) {
        console.log(`error getting recently viewed: ${error}`);
    }
}

export const getOfficialFrameworks = async() => {
    try {
        const response  = await axios.get('http://127.0.0.1:8000/frameworks/all', 
            {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
            return response.data;
    } catch (error) {
        console.log(`Error getting frameworks: ${error}`)
    }
}

export const getIndicatorInfo = async(companyName) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/indicators/${companyName}`, 
            { headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
            return response.data;  
    } catch (error) {
        console.log(`Error getting indicators: ${error}`);
    }
}

export const getMetricForFramework = async(frameworkId) => {
    console.log(frameworkId);
    try {
        const response = await axios.get(`http://127.0.0.1:8000/framework/metrics/${frameworkId}`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });

        return response.data;
    } catch (error) {
        console.log(`Error getting metric: ${error}`)
    }
}

export const getMetricName = async(metricId) => {
    //console.log('Getting Name for Metric Id: ', metricId);
    try {   
        const response = await axios.get(`http://127.0.0.1:8000/metric?metric_id=${metricId}`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });

        return response.data.name;
    } catch (error) {
        console.log(`Error getting metric: ${error}`);
    }
}

export const getUserId = async() => {
    try {   
        const response = await axios.get('http://127.0.0.1:8000/user',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });

        return response.data;
    } catch (error) {
        console.log(`Error getting userID: ${error}`);
    }
}

export const getIndicatorsForMetric = async(frameworkId, metricId) => {
    console.log(frameworkId);
    console.log(metricId);
    try {   
        const response = await axios.get(`http://127.0.0.1:8000/indicators?framework_id=${frameworkId}&metric_id=${metricId}`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        console.log('Indicators for metric ', metricId);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(`Error getting metric: ${error}`);
    }
}

export const getAllIndicators = async() => {
    try {   
        const response = await axios.get(`http://127.0.0.1:8000/indicators/all_by_id`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(`Error getting metric: ${error}`);
    }
}

export const getIndicatorsInfoByName = async() => {
  try {   
      const response = await axios.get(`http://127.0.0.1:8000/indicators/all_by_name`,
      {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }
      });

      return response.data;
  } catch (error) {
      console.log(`Error getting metric: ${error}`);
  }
}

export const getCompaniesOfIndustryByBatch = async(search, loadedOptions, { page }, industryName) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/industry/companies', 
        {
            params: {
                industry: industryName,
                page: page,
                search: search 
            },             
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        const filteredOptions = response.data
            .map(company => ({
              value: company.id,
              label: company.company_name,
            })
        );

        return {
            options: filteredOptions,
            hasMore: response.data.length >= 20, // there might be more data if we get results
            additional: {
              page: page + 1,
            }
        }
    } catch (error) {
        console.error('Error fetching companies:', error);
        return {
          options: [],
          hasMore: false,
        };
    }
}

export const getRecommendedCompanies = async(industryName) => {
  try {
      const response = await axios.get('http://127.0.0.1:8000/industry/companies/recommended', 
      {
          params: {
              industry: industryName,
          },             
          
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }
      });

      return response.data;
  } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
  }
}
// Given a framework already, requires company Indicators by metric
// indicators List of json objects {id, indicator_id, indicator_name (string), metric_id, weighting (float)}
// used pre-stored data from the json file to avoid continuously accessing it
// export const getMetricScore = async(indicators, companyValues) => {
//         let overallScore = 0;
//         console.log('Calculating Metric...');

//         const weights = indicators.reduce((acc, indicator) => {
//             acc[indicator.indicator_name] = indicator.weighting;
//             return acc;
//          },{});

//          companyValues.forEach(value => {
//             const indicatorScaling = indicatorData[value.indicator_name];
//             if (!indicatorScaling) return;

//             const {lower, higher} = indicatorScaling;
//             if (higher === lower) return;

//             let scaledScore;
//             if (indicatorScaling.indicator === 'positive') {
//                 scaledScore = 100 * (value.indicator_value - lower) / (higher - lower);
//             } else {
//                 scaledScore = 100 * (higher - value.indicator_value) / (higher - lower);
//             }
//             overallScore += scaledScore * (weights[value.indicator_name] || 0);
//          });
//     }

// export const getFrameworkScore = async(framework) => {
//     let totalScore = 0;
//      const categories = ["E", "S", "G"];
//      categories.forEach((category) => {});  
// }
export const getIndustryMean = async(frameworkId, industryName) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/industry/average/', 
        {
            params: {
                industry: industryName,
                framework_id: frameworkId
            },             
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(`Error getting metric: ${error}`);
    }
}

export const getMetricCategory = async(category) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/metrics/category', 
            {
                params: {
                    category: category
                },             
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });
            return response.data;
    } catch (error) {
        console.log(`Error getting metrics for categorty: ${error}`)
    }
}

export const getIndustry = async(companyId) => {
    console.log('getting industry for company: ', companyId);
    try {
        const response = await axios.get(`http://127.0.0.1:8000/industry?company_id=${companyId}`, 
            {
                params: {
                    category: companyId
                },             
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });
            return response.data;
    } catch (error) {
        console.log(`Error getting industry: ${error}`)
    }
}

export const getMetricByCategory = (category) => {
    try {
        
    } catch (error) {
        console.log('problem getting metrics by category ', category, error);
    }
}

//returns list of JsOn of form {category, id, name}
export const getAllMetrics = async() => {
    const cacheURL = 'http://127.0.0.1:8000/metrics';
    try {
        const cache = await caches.open('allMetrics');
        const cachedResponse = await cache.match(cacheURL);
        if (cachedResponse) {
            return await cachedResponse.json();
        }

        const response = await axios.get(cacheURL,
            {headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }});
        
        const responseClone = new Response(JSON.stringify(response.data));
        cache.put(cacheURL, responseClone);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
    

    //caches.open('allMetrics').then()

    // try {
    //     const response = await axios.get(`http://127.0.0.1:8000/metrics`,
    //         {headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${Cookies.get('authToken')}`
    //       }});
    //       //if successful
    //       return response.data;
    // } catch (error) {
    //     console.log(error);
    //     return [];
    // }
}

// This function is used in our Compare.jsx
// given a company Id, return all the information for that company
// This function is used in the compare Industry
// gets passed in metricList's objects
// 
// RETURNS {metricId, category, metricName, companies:[{companyId, score}]}
// companyList consists of:
// {
//     id: company.value,
//     companyName: company.label,
//     framework: selectedFramework ?? null,
//     year: null,
//     selected: false
// }

export const getMetricScore = async(metricId, companyName, year, frameworkId = undefined) => {
  try {
      let path = `metric_id=${metricId}&company_name=${companyName}&year=${year}`;
      if (frameworkId !== undefined) {
          path += `&framework_id=${frameworkId}`
      }
      const response = await axios.get(`http://127.0.0.1:8000/metric/score?${path}`, 
          { 
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }
          });
          return response.data;
  } catch (error) {
      console.log(`Error calculating metric score: ${error}`)
  }
}

Number.prototype.countDecimals = function () {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0;

  var str = this.toString();
  if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
      return str.split("-")[1] || 0;
  } else if (str.indexOf(".") !== -1) {
      return str.split(".")[1].length || 0;
  }
  return str.split("-")[1] || 0;
}

export const roundMetricScore = async(metricId, companyName, year, frameworkId = undefined) => {
  let metricScore = await getMetricScore(metricId, companyName, year, frameworkId);
  console.log(metricScore);
  // metricScore = metricScore.toPrecision(3);
  // console.log(metricScore);
  let formattedScore;
  if (metricScore.countDecimals() > 3) {
    formattedScore = metricScore.toExponential(3); 
  } else {
    formattedScore = metricScore.toPrecision(3); 
  }

  // Return the formatted score
  return formattedScore;
}
// companyList has objects of form : {
//   name,
//   id
// }
export const calculateMetricScore = async(metricId, metricName, metricCategory, framework_id, companyList, year) => {
  // get industries for metric
  console.log(companyList);
  const companies = await Promise.all(companyList.map(async c => ({
    companyId : c.id,
    score: await roundMetricScore(metricId, c.companyName, year, framework_id),
  })));
  // return collected information, (in future maybe ESG score if framework and industry ranking)
  return {metricId, metricName, category: metricCategory, companies};
}

export const getAllMetricsAvailable = async() => {
    
    try {
        const response = await axios.get(`http://127.0.0.1:8000/metrics`, 
            {           
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });
            return response.data;
    } catch (error) {
        console.log(`Error getting industry: ${error}`)
    }
}

export const getIndicatorFromMetric = async(metricId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/indicators/metric?metric_id=${metricId}`, 
            {           
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });
            return response.data;
    } catch (error) {
        console.log(`Error getting industry: ${error}`)
    }
}

export const webscrapeLinks = async(link) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/articles?URL=${link}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        console.log('successfully web-scraped');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('error webscraping link ', link);
    }
}

export const getMetricScoreByYear = async(companyIndicatorsByYear, indicatorWeights) => {
    console.log(companyIndicatorsByYear);
    console.log(indicatorWeights);
    try {
        const response = await axios.post(`http://127.0.0.1:8000/company/metric/`,
          {
            company_indicators: companyIndicatorsByYear,
            indicators: indicatorWeights
          },
          {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        }});
        //if successful
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const companyScoreGeneral = async(scoreAndWeighting) => {
    console.log(scoreAndWeighting);
    try {
        const response = await axios.post(`http://127.0.0.1:8000/company/score/`,
          {
            values: scoreAndWeighting
          },
          {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        }});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getIndicatorLineGraph = async(companies) => {
  try {
          if (companies.length === 0) {
            return {};
          }
          console.log(companies);
          const queryString = companies.map(company => `companies=${company}`).join('&');
          const path = `http://127.0.0.1:8000/graph/indicator/line?${queryString}`;

          const response = await axios.get(path,           {           
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }
          });
          return response.data;
  } catch (error) {
      console.log(`Error getting industry: ${error}`)
  }
}


export const getIndicatorBarGraph = async(companies) => {
  try {
      if (companies.length === 0) {
        return {};
      }
      console.log(companies);
      const queryString = companies.map(company => `companies=${company}`).join('&');
      const path = `http://127.0.0.1:8000/graph/indicator/bar?${queryString}`;

      const response = await axios.get(path, 
          {           
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }
          });
          return response.data;
  } catch (error) {
      console.log(error);
      console.log(`Error getting industry: ${error}`)
  }
}

export const getMetricBarGraph = async(frameworkId, companies) => {
  try {
      if (companies.length === 0) {
        return {};
      }
      console.log(companies);
      const queryString = companies.map(company => `companies=${company}`).join('&');
      const path = `http://127.0.0.1:8000/graph/metric/bar?framework_id=${frameworkId}&${queryString}`;

      const response = await axios.get(path, 
          {           
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('authToken')}`
              }
          });
          return response.data;
  } catch (error) {
      console.log(error);
      console.log(`Error getting industry: ${error}`)
  }
}

export const mapToTicker = async() => {
    
}

export const getDetailedCompanyInformation = async(companyCode) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/information/${companyCode}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }, 
                params: {
                    company_code: companyCode
                }
            } 
        );
          //if successful
          console.log('Successfully fetched company Information for ', companyCode);
          console.log(response.data);
          return response.data;
    } catch (error) {
        console.log('error getting detailed company Information: ', error);
        return;
    }
}

export const getCompanyHistory = async(companyCode, period) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/information/${companyCode},${period}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }, 
                params: {
                    company_code: companyCode,
                    period: period
                }
            } 
        );
          //if successful
          console.log('Successfully fetched history for ', companyCode);
          console.log(response.data);
          return response.data;
    } catch (error) {
        console.log('error getting company history: ', error);
        return;
    }
}

export const getCompanySustainability = async(companyCode) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/sustainability/${companyCode}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }, 
                params: {
                    company_code: companyCode,
                }
            } 
        );
          //if successful
          console.log('Successfully fetched sustainability status for ', companyCode);
          console.log(response.data);
          return response.data;
    } catch (error) {
        console.log('error getting company sustainability scores: ', error);
        return;
    }
}
export const getPrediction = async(indicatorName, metricUnit, companyName) => {
    try {

            const path = `http://127.0.0.1:8000/predictive?indicator=${indicatorName}&metric_unit=${metricUnit}&company_name=${companyName}`;
  
            const response = await axios.get(path,           {           
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });
            return response.data;
    } catch (error) {
        console.log(`Error getting industry: ${error}`)
    }
  }

  export const getCompaniesInList = async(listId) => {
    try {
    const response = await axios.get(`http://127.0.0.1:8000/list?list_id=${listId}`, 
        {           
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(`Error getting industry: ${error}`)
    }
  }

  export const deleteList = async(listId) => {
    console.log(listId);
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/list?list_id=${listId}`, 
            {    
                       
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(`Error getting industry: ${error}`)
        }
}

export const putFrameworkModifyMetrics = async (frameworkId, metrics, categoryWeightings) => {
    try {
        const response = await axios.put(
            `http://127.0.0.1:8000/framework/modify_metrics/?framework_id=${frameworkId}`,
            {
                metrics: metrics,
                category_weightings: categoryWeightings
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(`Error modifying metrics: ${error}`);
        throw error; // Optionally rethrow the error if you want to handle it further up the call chain
    }
};

// get headquarter countries
export const getHeadquarterCountries = async() => {
  try {
      const response = await axios.get('http://127.0.0.1:8000/headquarter_countries', 
          {headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }});
      return response.data;
  } catch (error) {
      console.log(`error getting headquarter countries: ${error}`);
  }
}

export const getCompanyByCountryByIndustry = async(industry, countries, page) => {
  try {
      const response = await axios.post(`http://127.0.0.1:8000/companies/${industry}`, 
          {
            countries: countries,
            industry: industry,
            page: page
          },
          {headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
          }});
      return response.data;
  } catch (error) {
      console.log(`error getting headquarter countries: ${error}`);
      return {
        total: 0,
        companies: []
      }
  }
}