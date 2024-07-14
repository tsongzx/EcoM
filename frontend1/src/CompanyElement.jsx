import React from "react";
import { useNavigate } from "react-router-dom";

const CompanyElement = ({id}) => {
    const navigate = useNavigate();

    return (
        <button onClick={() => {navigate(`/company/${id}`)}}>
            <p>COMPANY {id}</p>
        </button>
    )
}

export default CompanyElement;