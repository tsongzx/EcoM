import React, {useState, useEffect} from "react";
import { fetchCompanies } from "../helper";
import { Select } from "@mui/material";


//takes in a function that retuns which company id was send
const CompanySearch = ({handleSelectedCompanyId}) => {
    const [listOfCompanies, setListOfCompanies] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    //on mount collect all the companies there are
    useEffect(async() => {
        const companiesAvailable = await fetchCompanies(page);
        setListOfCompanies(prevCompanies => [...prevCompanies, ...companiesAvailable]);
        setHasMore(companiesAvailable.length > 0);
    },[]);

    //Maybe we have to load all of them in one go
    const handleMenuScrollToBottom = () => {
        if (!loading && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      };

    return (
        <Select
            styles={{ container: (provided) => ({ ...provided, width: '50%' }) }}
            options={listOfCompanies.map(company => ({ value: company.id, label: company.company_name }))}
            placeholder="Select Company"
            onChange={(selectedOption) => handleSelectedCompanyId(selectedOption.value, selectedOption.label)}
            maxMenuHeight={100}
            onMenuScrollToBottom={handleMenuScrollToBottom}
        />
    );
}

export default CompanySearch;