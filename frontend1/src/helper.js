import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get('authToken');

export const fetchLists = async() => {
    //get the names of all the lists and whether the company is contained inside that list
    //contain that information inside watchlist in the set State

    //also return whether the list contains such element
    try {
        const response = await axios.get('http://127.0.0.1:8000/lists', {
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('successfully returned lists');
        return response.data.lists;
    } catch (error) {
        console.log(`error fetching the user's watchlists`, error);
    }
}

//creates a new Watchlist with name : name
export const createList = async ({name}) => {
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
export const addCompanyToList = async ({listId, companyId }) => {
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

//get watchlists for modal (name and isChecked) This function will run ONLY ONCE at the start of the WatchListModal initialisation
//returns list of JSON objects {id: '', name: '', isChecked: ''}
export const getFormattedUserLists = async ({companyId}) => {
    //first fetch all the lists the user has
    const lists = fetchLists();
    //for each list Id check if the company is in it and append to a list of JSON

    //returns a list of arrays of the form of a JSOn with list.id, list.checked and list.name

}