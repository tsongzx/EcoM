import React, { useState } from "react";
import { getCompaniesOfIndustry } from "../helper";
//given a Company Id return a mapped list of buttons of companies in that industry

const Recommendations = ({companyId}) => {
    const [reccs, setReccs] = useState([]);
    const [industryName, setIndustryName] = ('');
    //get the industry of the company
    
    //filter out the companies that are in the industry and do not have the id of the current company

    //return 3 random companies
}

export default Recommendations;