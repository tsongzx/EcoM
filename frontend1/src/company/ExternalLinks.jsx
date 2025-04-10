import React, { useEffect, useState } from "react";
import { getSentiment } from "../helper";
import './company_css/ExternalLinks.css'
const ExternalLinks = ({ticker}) => {
    const [links, setLinks] = useState([]);
    useEffect(() => {
        const initExternalLinks = async() => {
            const sentiment = await getSentiment(ticker);
            if (Object.keys(sentiment).length === 0 && sentiment.constructor === Object){
                return;
            }
            setLinks(sentiment);
        }
        console.log('inside external links');
        initExternalLinks();
    },[ticker]);

    return (
      <div className="externalLinks-container">
        {links.map(link => {
            return (<a href={link.URL} target="_blank" rel="noreferrer">
                <button className="externalLink-button">{link["Article Title"]}</button>
            </a>);
        })}
        {(links.length === 0) && <p>No Available Articles</p>}
      </div>
    );
}

export default ExternalLinks;