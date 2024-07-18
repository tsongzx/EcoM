import React, { useState } from "react";
import './Report.css'
import Switch from '@mui/material/Switch';

/**
 * This function will allow us to modify the Company page to adjust what we would like 
 * the content on our downloaded report to have
 * 
 * @returns {React}
 */
const Report = () => {
    const { companyId } = useParams();
    const [toggled, setToggled] = useState(false);

    return (
        <div className="reportContainer">
            <div className="reportContent">

            </div>
            <div className="reportControl">
                <Switch onChange={() => {}} />
            </div>
        </div>
    );
}

export default Report;