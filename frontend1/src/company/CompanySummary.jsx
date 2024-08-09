import React, { useEffect, useState } from "react";
import './company_css/CompanySummary.css'
import { getDetailedCompanyInformation, getCompanySustainability } from "../helper";
import Table from '@mui/joy/Table';
import { bigNumberFormatter } from "../helper";

export const CompanySummary = ({ companyName, ticker }) => {
  const [information, setInformation] = useState(null);
  const [sustainability, setSustainability] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [susLoading, setSusLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const info = await getDetailedCompanyInformation(ticker);
        const sus = await getCompanySustainability(ticker);

        setInformation(info);
        setSustainability(sus.esgScores);
      } catch (error) {
        console.log('error');
      }
      finally {
        setSummaryLoading(false);
        setSusLoading(false);
      }

    }
    init();
  }, [ticker]);

  return (
    <div className="company-summary-container">
      <div className="company-long-summary">
        {(information && 'webite' in information && information.website) ? (<a href={information.website}>{companyName}</a>) : (<h2>{companyName}</h2>)}
        {summaryLoading ? 'loading summary...' : (<p className="company-long-summary-text">{(information && 'longBusinessSummary' in information && information.longBusinessSummary) ? information.longBusinessSummary : 'No summary available'}</p>)}
      </div>
      <div className="company-live-metadata">
        {(sustainability && Object.keys(sustainability).length !== 0) ?
          (<Table>
            <tr> <td>Industry</td> <td> {information.industry} </td> </tr>
            <tr> <td>Market Capital</td> <td> {bigNumberFormatter(information.marketCap)} </td> </tr>
            <tr> <td>Total Debt</td> <td> {bigNumberFormatter(information.totalDebt)} </td> </tr>
            <tr> <td>Total Revenue</td> <td> {bigNumberFormatter(information.totalRevenue)} </td> </tr>
            <tr>  <td>Category</td> <td>Company Score</td> <td>Peer Average</td></tr>
            <tr> <td>ESG Score</td> <td>{sustainability.totalEsg}</td><td>{sustainability.peerEsgScorePerformance?.avg.toFixed(2)}</td></tr>
            <tr> <td>Environment</td> <td>{sustainability.environmentScore}</td> <td>{sustainability.peerEnvironmentPerformance?.avg.toFixed(2)}</td></tr>
            <tr> <td>Social</td> <td>{sustainability.socialScore}</td> <td>{sustainability.peerSocialPerformance?.avg.toFixed(2)}</td></tr>
            <tr> <td>Governance</td> <td>{sustainability.governanceScore}</td> <td>{sustainability.peerGovernancePerformance?.avg.toFixed(2)}</td></tr>
            <tr> <td> Rating Year </td> <td>{sustainability.ratingYear}</td> </tr>
          </Table>) :
          (
            <Table>
              <tr><td>{susLoading ? 'loading...' : 'no data available'}</td></tr>
            </Table>
          )}
      </div>
    </div>)
}

export default CompanySummary;