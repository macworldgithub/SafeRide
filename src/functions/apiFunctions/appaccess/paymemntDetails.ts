import axios from 'axios';
import CryptoJS from 'crypto-js';
import {XMLParser} from 'fast-xml-parser';

type GetPaymentDetailsResponse = {
    ResponseCode?: number;
    ResponseText?: string;
    CUST_ID?: string;
    CC_TYPE?: string;
    CC_NO?: string;
    CC_MO?: string;
    CC_YR?: string;
    CC_NAME?: string;
    ADDRESS?: string;
    CITY?: string;
    STATE?: string;
    ZIP?: string;
    PHONE?: string;
  };
type UpdatePaymentDetailsResponse = {
    ResponseCode?: number;
    ResponseText?: string;
  };

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

export const getPaymentDetails = async (
    custId: string,
    token: string,
): Promise<GetPaymentDetailsResponse> =>{
    try {
        // Generate the MD5 hash of today's date
        const today = getFormattedDate();
        const code = CryptoJS.MD5(today).toString();
    
        console.log(
          'get account details response',
          `${BASE_URL}/getCreditCard.aspx?CODE=${code}&CUST_ID=${custId}&TOKEN=${token}`,
        );
    
        const response = await axios.get(
          `${BASE_URL}/getCreditCard.aspx?CODE=${code}&CUST_ID=${custId}&TOKEN=${token}`
        );
    
        if (response.status === 200 && response.data) {
          const parser = new XMLParser();
          let jObj = parser.parse(response.data);
    
          console.log('Response jObj', jObj);
    
          return {
            ResponseCode: jObj?.Response.ResponseCode,
            ResponseText: jObj?.Response.ResponseText,
            CUST_ID: jObj?.Response.CUST_ID,
            CC_TYPE: jObj?.Response.CC_TYPE,
            CC_NO: jObj?.Response.CC_NO,
            CC_MO: jObj?.Response.CC_MO,
            CC_YR: jObj?.Response.CC_YR,
            CC_NAME: jObj?.Response.CC_NAME,
            ADDRESS: jObj?.Response.ADDRESS,
            CITY: jObj?.Response.CITY,
            STATE: jObj?.Response.STATE,
            ZIP: jObj?.Response.ZIP,
            PHONE: jObj?.Response.PHONE,
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
          CC_TYPE: '',
            CC_NO: '',
            CC_MO: '',
            CC_YR: '',
            CC_NAME: '',
            ADDRESS: '',
            CITY: '',
            STATE: '',
            ZIP: '',
            PHONE: '',
        };
      }

}
export const updatePaymentDetails = async (
    custId: string,
    token: string,
    cardType:string,
    cardNo:string,
    address:string,
    city:string,
    // state:string,
    // zip:string,
    CCV:string,
    Valid:string,
    Phone:string,
    holder_name:string,
    state:string,
    zip:string,

): Promise<UpdatePaymentDetailsResponse> =>{
    try {
        // Generate the MD5 hash of today's date
        const today = getFormattedDate();
        const code = CryptoJS.MD5(today).toString();
        const formData = new FormData();
console.log(custId,Valid?.split("/")[0])
    formData.append('CUST_ID', custId);
    formData.append('TOKEN', token);
    formData.append('CC_TYPE', cardType);
    formData.append('CC_NO', cardNo);
    formData.append('ADDRESS', address);
    formData.append('CITY', city);
    formData.append('CC_NAME', holder_name);
    formData.append('ZIP', zip);
    formData.append('STATE', state);
    formData.append('CCV', CCV);
    formData.append('CC_MO', Valid?.split("/")[0]);
    formData.append('CC_YR', Valid?.split("/")[1]);
    console.log("error chcrking")
    formData.append('PHONE', Phone);
    console.log(formData,"formdata")    
    console.log(
          'update account details response',
          `${BASE_URL}/updateCreditCard.aspx?CODE=${code}`,
        );
    
        const response = await axios.post(
          `${BASE_URL}/updateCreditCard.aspx?CODE=${code}` ,formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
    
        if (response.status === 200 && response.data) {
          const parser = new XMLParser();
          let jObj = parser.parse(response.data);
    
          console.log('Response jObj', jObj);
    
          return {
            ResponseCode: jObj?.Response.ResponseCode,
            ResponseText: jObj?.Response.ResponseText,
          };
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        return {
            ResponseCode: 500,
          ResponseText: 'An error occurred while fetching the payment details',
          
        };
      }

}
  