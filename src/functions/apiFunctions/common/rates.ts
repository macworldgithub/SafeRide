import axios from 'axios';
import CryptoJS from 'crypto-js';
import { XMLParser } from 'fast-xml-parser';

interface RatesList {
  VEH_DESC: string;
  VEH_ID: string;
  VEH_NAME: string;
  VEH_RATE: number;
  MINUTES: number;
  VEH_CAP: number;
  DONATION: number;
}

interface RatesResponse {
  ResponseCode: number;
  ResponseText: string;
  Rates: RatesList[];
}

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const getRates = async (jobType: string, min: number, people: string, pick_city: string, pick_state: string, dest_city: string, dest_state: string): Promise<RatesResponse> => {
  console.log("Request to getRates", jobType, min, people, pick_city, pick_state, dest_city, dest_state)
  try {
    const today = getFormattedDate();
    const code = CryptoJS.MD5(today).toString();

    const formData = new FormData();
    formData.append("JOB_TYPE", jobType);
    formData.append("MINUTES", min);
    formData.append("PEOPLE", people);
    formData.append("JOB_CITY", pick_city);
    formData.append("JOB_STATE", pick_state);
    if (jobType !== "H") {
      formData.append("DEST_CITY",  dest_city);
      formData.append("DEST_STATE", dest_state);      
    }

    console.log("formData", formData);
    const response = await axios.post(`${BASE_URL}/getRates.aspx?CODE=${code}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log("getRates api response", response);
    if (response.data) {

      const parser = new XMLParser();
      let jObj = parser.parse(response.data);
      // Map the response to the RatesResponse interface
      const ratesResponse: RatesResponse = {
        ResponseCode: jObj.Response.ResponseCode,
        ResponseText: jObj.Response.ResponseText,
        Rates: jObj.Response?.Rates?.Rate.map((rate: any) => ({
          VEH_DESC: rate.VEH_DESC,
          VEH_ID: rate.VEH_ID,
          VEH_NAME: rate.VEH_NAME,
          VEH_RATE: parseFloat(rate.VEH_RATE),
          MINUTES: parseInt(rate.MINUTES, 10),
          VEH_CAP: parseInt(rate.VEH_CAP, 10),
          DONATION: parseInt(rate.DONATION, 10),
        })),
      };

      return ratesResponse;
    } else {
      throw new Error('No data received');
    }
  } catch (error) {
    console.error('Error fetching rates:', error);
    return {
      Rates: [],
      ResponseCode: 500,
      ResponseText: error + "",
    }
  }
};
