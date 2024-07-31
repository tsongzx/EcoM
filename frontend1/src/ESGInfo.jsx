import React, { useState } from "react";
import environmentImage from './assets/environmental.jpg';
import socialImage from './assets/social.jpg';
import governanceImage from './assets/governance.jpg';
import './ESGInfo.css';

const ESGInfo = () => {
  const [E, setE] = useState(false);
  const [S, setS] = useState(false);
  const [G, setG] = useState(false);


  return (
    <div className="ESGInfo-container">
      <div className="ESGInfo-title">
        <h1>What's ESG???</h1>
        <p>ESG refers to the environmental, social, and governance factors that investors measure when analyzing a company's sustainability efforts from a holistic view. Many companies publish ESG reports in alignment with ESG reporting frameworks, standards, regulations, or investor expectations to demonstrate transparency and disclose the environmental, social, and governance factors that contribute to the overall risks and opportunities involved with a company’s operations. The types of data included can vary from greenhouse gas emissions to labor practices, workforce diversity, executive compensation, and more. Confused yet? Don’t worry, we’re going to break all of this down for you.</p>
      </div>

      <span>
        <button onClick={() => setE(!E)}>E</button>
        <button onClick={() => setS(!S)}>S</button>
        <button onClick={() => setG(!G)}>G</button>
      </span>

      <div className="ESGCategory-container">
        <img className='ESGCategoryImg' src={environmentImage} alt='Some trees'/>
        <div className="ESGCategory-Text">
            <h1>Environmental</h1>
            <p>The “E” in ESG means the environmental responsibility companies have, including energy use and how they manage their environmental impacts as stewards of the planet. Some examples of environmental issues are:
                Carbon emissions
                Energy consumption
                Climate change effects
                Pollution
                Waste disposal
                Renewable energy
                Resource depletion</p>
            </div>
      </div>
    
      <div className="ESGCategory-container">
        <div className="ESGCategory-Text">
        <h1>Social</h1>
        <p>The data disclosed in the social responsibility portion of ESG covers a wide range of topics from how companies are fostering people and culture to diversity statistics and community impact. Some examples of social topics are:
          Discrimination
          Diversity
          Human rights
          Community relations
        </p>
        </div>
        <img className='ESGCategoryImg' src={socialImage} alt='Some people'/>
      </div>

      <div className="ESGCategory-container">
        <img className='ESGCategoryImg' src={governanceImage} alt='Some people'/>
        <div className="ESGCategory-Text">
            <h1>Governance</h1>
            <p>Governance
                Governance in ESG covers how companies are directed and controlled—and how leaders are held accountable. Increased transparency into corporate governance is quickly becoming an expectation. Some example topics related to governance include:
                Open configuration options
                Executive compensation
                Shareholder rights
                Takeover defense
                Staggered boards
                Independent directors
                Board elections
                Political contributions
            </p>
        </div>
      </div>

      <div className="ESGReporting-container">
        <h1>What is ESG Reporting?</h1>
        <p>ESG reporting involves disclosing information about a company's operations and risks in three areas: environmental stewardship, social responsibility, and corporate governance. Investors can use ESG reports to identify which companies to invest in with less financial risk because of their environmental impact, social standards, or governance structure. ESG reports help investors avoid companies that may be impacted by more strict ESG metrics in the future or other risks related to ESG data included in their reports. This is called ESG investing and it’s driving companies to adjust their corporate ESG strategies to focus on providing more information and transparency in their ESG disclosures.</p>
      </div>

      <div className="ESGScore-containers">
        <h1>What is an ESG Score?</h1>
        <p>ESG scores can be looked at as ESG risk indicators. They are generated based upon a company's performance across their numerous environmental, social, and governance metrics. Put simply, ESG scores are a numerical value to help simplify the ESG risk and performance rating of a company for comparative purposes. These ESG scores are complicated though because score providers, ratings agencies, and rankers evaluate different criteria to determine scores. Some request information from companies via surveys or questionnaires, others review public disclosures, and some do a combination. ESG scores are important because they provide a baseline for evaluating a company’s ESG risk, but without broad and standardized reporting frameworks (and regulations to enforce accurate and complete reporting), ESG scores are only as accurate as the data that companies have chosen to disclose—or what can be found online. Nevertheless, investors are using these scores to help evaluate where to direct their money in the absence of standardized disclosures</p>
      </div>

      <div className="ESGScore-externalLinks-container">
        {/* each consits of {title, link} */}
        <button className="ESGScore-ext-raise-button">
          test
        </button>
      </div>
    </div>
  );
}

export default ESGInfo;