import React, {useState, useEffect} from "react";
import { fetchCompanies } from "../helper";
import {MenuItem } from "@mui/material";
import Select from 'react-select';

//takes in a function that retuns which company id was send
const CompanySearch = ({handleSelectedCompanyId}) => {
    const [listOfCompanies, setListOfCompanies] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selected, setSelected] = useState(null);
    //on mount collect all the companies there are
    useEffect(() => {
        const fetchAndSetCompanies = async () => {
          setLoading(true);
          const companiesAvailable = await fetchCompanies(page);
          console.log('Companies available:', companiesAvailable);
          setListOfCompanies(prevCompanies => [...prevCompanies, ...companiesAvailable]);
          setHasMore(companiesAvailable.length > 0);
          setLoading(false);
        };
    
        fetchAndSetCompanies();
      }, [page]);

    //Maybe we have to load all of them in one go
    const handleMenuScrollToBottom = () => {
        if (!loading && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      };

    const handleOnSubmit = (selectedOption) => {
        setSelected(null);
        handleSelectedCompanyId(selectedOption.value, selectedOption.label);
    }

    return (
        <Select
            styles={{ 
              container: (provided) => ({ ...provided, width: '50%' }),
              menu: (provided) => ({ ...provided, zIndex: 1300 }),
            }}
            options={listOfCompanies.map(company => ({ value: company.id, label: company.company_name }))}
            placeholder="Select Company"
            value={selected}
            onChange={(selectedOption) => handleOnSubmit(selectedOption)}
            maxMenuHeight={100}
            onMenuScrollToBottom={handleMenuScrollToBottom}
            label="Company"
        />
        // listOfCompanies.map((company) => (
        //     <Option
        //       key={company.id}
        //       value={company.id}
        //     >
        //       {company.company_name}
        //     </Option>
        //   ))}
        // </Select>
    );
}

export default CompanySearch;