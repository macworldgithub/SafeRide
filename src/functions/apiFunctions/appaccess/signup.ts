import axios from 'axios';
import CryptoJS from 'crypto-js';
import { XMLParser } from 'fast-xml-parser';

interface CreateAccountResponse {
  ResponseCode: number;
  ResponseText: string;
  CUST_ID?: string;
  TOKEN?: string;
}

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const createAccount = async (
  fname: string,
  lname: string,
  mphone: string,
  email: string,
  pass: string,
  pass2: string,
): Promise<CreateAccountResponse> => {
  try {
    // Generate the MD5 hash of today's date
    const today = getFormattedDate(); // Get the current date in YYYY-MM-DD format
    const code = CryptoJS.MD5(today).toString();

    const formData = new FormData();

    formData.append('FNAME', fname.trim());
    formData.append('LNAME', lname ? lname.trim() : "");
    formData.append('MPHONE', mphone.trim());
    formData.append('EMAIL', email.trim());
    formData.append('PASS', pass.trim());
    formData.append('PASS2', pass2.trim());

    const response = await axios.post(
      `${BASE_URL}/createAccount.aspx?CODE=${code}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200 && response.data) {
      //parsing xml
      const parser = new XMLParser();
      let jObj = parser.parse(response.data);

      console.log('Response jObj', jObj);
      return {
        ResponseCode: jObj?.Response.ResponseCode,
        ResponseText: jObj?.Response.ResponseText,
        TOKEN: jObj?.Response.TOKEN,
        CUST_ID: jObj?.Response.CUST_ID,
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error creating account:', error);
    return {
      ResponseCode: 500,
      ResponseText: 'An error occurred while creating the account',
    };
  }
};
