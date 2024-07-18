import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get('authToken');

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
export const fetchCompanies = async(page) => {
    console.log('Getting all the companies available');
    try {
        const response = await axios.get('http://127.0.0.1:8000/company', 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                },
                params: {
                    page: page
                }
            }
        );
        const companies = response.data.slice(0, 20);
        return companies;
    } catch (error) {
        console.log('Error fetching the companies', error);
        return [];
    }
}

export const getCompanyFromRecentlyViewed = async (companyId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/${companyId}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }, 
                params: {
                    company_id: companyId
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
        const companyIds = response.data.map(company => company.id);
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
            list_id: Number(listId),
            company_id: Number(companyId),
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
    console.log(companyId);
    console.log(Cookies.get('authToken'));
    try {
        const response = await axios.delete('http://127.0.0.1:8000/list/company', {
            list_id: Number(listId),
            company_id: Number(companyId)
        }, {headers: {
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
    try {
        const response = await axios.post(`http://127.0.0.1:8000/watchlist?company_id=${companyId}`, 
          {},  
          {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
        return response.data;
    } catch (error) {
        console.log(`error adding to favourites: ${error}`);
    }
}

export const deleteFromFavourites = async(companyId) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/watchlist?company_id=${companyId}`, 
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
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
        const response  = await axios.get('http://127.0.0.1:8000/official_framework/all', 
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
    console.log(companyName);
    try {
        const response = await axios.get(`http://127.0.0.1:8000/company/indicators/${companyName}`, 
            { params: {
                company_name: companyName
            }, headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('authToken')}`
            }});
            return response.data;  
    } catch (error) {
        console.log(`Error getting indicators: ${error}`);
    }
}

export const getMetricForFramework = async(official, frameworkId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/framework/metrics/${frameworkId}`, 
        {
            params: {
                is_official_framework: Boolean(official),
                framework_id: frameworkId
            }, 
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
    try {   
        const response = await axios.get('http://127.0.0.1:8000/metric', 
        {
            params: {
                metric_id: metricId
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