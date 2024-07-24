import React, { useEffect, useState } from "react";
import { getCompaniesOfIndustry, getIndustry } from "../helper";
import { useNavigate } from "react-router-dom";
import './Recommendations.css';
//given a Company Id return a mapped list of buttons of companies in that industry

const Recommendations = ({companyId}) => {
    const [reccs, setReccs] = useState([]);
    // const [industryName, setIndustryName] = ('');
    //const [companies, setCompanies] = useState([]);
    //get the industry of the company
    useEffect(() => {
        const initialiseRecommendations = async(cId) => {
            const indName = await getIndustry(cId);
            const comp = await getCompaniesOfIndustry(indName);
            const newList = comp.filter(company => company.id !== companyId);
            const reccs = getRandom(newList);

            setReccs(reccs);
        }

        initialiseRecommendations(companyId);
    },[]);

    const navigate = useNavigate();

    const getRandom = (array) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    }
    
    return (
        <div className="recommendations-container">
            {reccs.map((r) => {
                <button onClick={() => navigate(`/company/${encodeURIComponent(r.id)}`, 
                { state: { 
                    companyId: r.id, 
                    companyName: r.company_name,
                    initialFramework: null
                  } 
                })}>{r.company_name}</button>
            })}
        </div>
    );
}

export default Recommendations;