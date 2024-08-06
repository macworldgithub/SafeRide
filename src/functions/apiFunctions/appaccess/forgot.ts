import axios from 'axios';
import CryptoJS from 'crypto-js';
import {XMLParser} from 'fast-xml-parser';

interface CreateAccountResponse {
  ResponseCode: number;
  ResponseText: string;
}

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const forgotPassword = async (
  email: string,
  lname: string,
): Promise<CreateAccountResponse> => {
  try {
    // Generate the MD5 hash of today's date
    const today = getFormattedDate(); // Get the current date in YYYY-MM-DD format
    const code = CryptoJS.MD5(today).toString();

    const formData = new FormData();

    formData.append('EMAIL', email);
    formData.append('LNAME',lname);

    console.log(
      'login account response',
      `${BASE_URL}/forgotPassword.aspx?CODE=${code}`,
    );
    const response = await axios.post(
      `${BASE_URL}/forgotPassword.aspx?CODE=${code}`,
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