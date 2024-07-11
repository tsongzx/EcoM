import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get('authToken');

export const fetchLists = async() => {
    //get the names of all the lists and whether the company is contained inside that list
    //contain that information inside watchlist in the set State
    console.log(`getting the user's lists`);
    //also return whether the list contains such element
    try {
        const response = await axios.get('http://127.0.0.1:8000/lists', {
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('successfully returned lists');
        console.log(response.data.lists);
        return response.data.lists;
    } catch (error) {
        console.log(`error fetching the user's watchlists`, error);
    }
}

//given a list id, get all the companies that are in that list
export const fetchCompaniesInList = async(listId) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/list', {
            list_id: listId
        }, {
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const companyIds = response.data.map(company => company.id);
        console.log(`List: ${listId}, companies: ${companyIds}`);
        return companyIds;

    } catch (error) {
        console.log('problem fetching companies in list ', listId, ' ', error);
    }
}

//creates a new Watchlist with name : name
export const createList = async (name) => {
    //create list
    try {
        const response = await axios.post('http://127.0.0.1:8000/list', {
            'list_name': name,
        }, 
        {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
        //if successful
        console.log('successfully added List name: ', name,  ' list id :', response.data.list_id);
        return response.data.list_id;
    } catch (error) {
        console.log(error);
    }

};

//add a company to list id
export const addCompanyToList = async (listId, companyId ) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/list/company', {
            list_id: listId,
            company_id: companyId,
        }, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
        //if successfully added
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}

export const removeCompanyFromList = async(listId, companyId) => {
    try {
        const response = axios.delete('http://127.0.0.1:8000/list/company', {
            list_id: listId,
            company_id: companyId,
        }, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
    if (lists === null) {
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

export const companyIsInList = async(listId, companyId) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/list', {
            list_id: listId
        }, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
        console.log(response.data);
        const companyExists = response.data.some(company => company.company_id === companyId);
        return companyExists;

    } catch (error) {
        console.log(error);
        return false;
    }
}