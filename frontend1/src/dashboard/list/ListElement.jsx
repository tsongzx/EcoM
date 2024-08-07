import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompaniesInList } from "../../helper.js";
import CompanyElement from "./CompanyElement.jsx";
/**
 * 
 * @param {*} param0 gets passed in the id of the LIST, fetches the information on the list
 * @returns 
 */
const ListElement = ({id, name, dateCreated}) => {
    const [listIsOpen, setlistIsOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [nCompanies, setNCompanies] = useState(-1);
    console.log(`creating list: ${id}: ${name} made on ${dateCreated}`);

    const handleOpenList = () => {
        //Open the Modal For the WatchList
        setlistIsOpen(!listIsOpen);
        //populate companies if companies is not empty
        if (companies.length === 0) {
            const companyList = fetchCompaniesInList(id);
            setCompanies(companyList);
            setNCompanies(companies.length);
        }
    }

    return (
        <div>
            <button className="listElement" onClick={handleOpenList}>
                <p>{name}</p>
                <p>{nCompanies} companies</p>
                <p>{dateCreated}</p>
            </button>
            {listIsOpen && <div className="listCompanies">
                {companies?.map((cId) => {
                    <CompanyElement id={cId}/>
                })}
            </div>}
        </div> 
    );
}

export default ListElement;