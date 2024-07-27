import React, { useEffect, useState } from "react";
import { getCompaniesOfIndustry, getIndustry, getFavouritesList } from "../helper";
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
            console.log(`Industry is ${indName}`);
            if (indName) {
                const comp = await getCompaniesOfIndustry(indName);
                console.log('companies in industry');
                console.log(comp);
                const newList = comp.filter(company => company.id !== companyId);
                const newReccs = getRandom(newList);
                console.log(newReccs);
                setReccs(newReccs);
            } else {
                console.log('no industry :( so imma get ur favs');
                const favs = getFavouritesList();
                const newReccs = getRandom(favs);
                console.log(newReccs);
                setReccs(newReccs);
            }
        }
        initialiseRecommendations(companyId);
    },[companyId]);

    const navigate = useNavigate();

    const getRandom = (array) => {
        if (!Array.isArray(array)) {
            console.error('Expected an array, received:', array);
            return [];
        }
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    }
    
    return (
        <div className="recommendations-container">
            {reccs.map((r) => (
                <button className="recommendations-button" 
                    key={r.id} 
                    onClick={() => navigate(`/company/${encodeURIComponent(r.id)}`, {
                        state: { 
                            companyId: r.id, 
                            companyName: r.company_name,
                            initialFramework: null
                        } 
                    })}
                >
                    {r.company_name}
                </button>
            ))}
        </div>
    );
}

export default Recommendations;