import axios from 'axios';
import CryptoJS from 'crypto-js';
import {XMLParser} from 'fast-xml-parser';

interface GetAccountDetailsResponse {
    ResponseCode: number;
    ResponseText: string;
    CUST_ID?: string;
    FNAME?: string;
    LNAME?: string;
    MPHONE?: string; 
    EMAIL?: string;
    SINCE?: string;
    LASTTIME?: string;
}

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

export const getAccountDetails = async (
    custId: string,
    token: string,
): Promise<GetAccountDetailsResponse> =>{
    try {
        // Generate the MD5 hash of today's date
        const today = getFormattedDate();
        const code = CryptoJS.MD5(today).toString();
    
        console.log(
          'get account details response',
          `${BASE_URL}/getAccountDetails.aspx?CODE=${code}&CUST_ID=${custId}&TOKEN=${token}`,
        );
    
        const response = await axios.get(
          `${BASE_URL}/getAccountDetails.aspx?CODE=${code}&CUST_ID=${custId}&TOKEN=${token}`
        );
    
        if (response.status === 200 && response.data) {
          const parser = new XMLParser();
          let jObj = parser.parse(response.data);
    
          console.log('Response jObj', jObj);
    
          return {
            ResponseCode: jObj?.Response.ResponseCode,
            ResponseText: jObj?.Response.ResponseText,
            CUST_ID: jObj?.Response.CUST_ID,
            FNAME: jObj?.Response.FNAME,
            LNAME: jObj?.Response.LNAME,
            MPHONE: jObj?.Response.MPHONE,
            EMAIL: jObj?.Response.EMAIL,
            SINCE: jObj?.Response.SINCE,
            LASTTIME: jObj?.Response.LASTTIME,
          };
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
        return {
          ResponseCode: 500,
          ResponseText: 'An error occurred while fetching the account details',
          CUST_ID: '',
          FNAME: '',
          LNAME: '',
          MPHONE: '',
          EMAIL: '',
          SINCE: '',
          LASTTIME: '',
        };
      }

}
  