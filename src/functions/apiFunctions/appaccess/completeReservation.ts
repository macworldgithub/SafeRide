import axios from 'axios';
import CryptoJS from 'crypto-js';
import {XMLParser} from 'fast-xml-parser';

interface CompleteReservationParams {
  APP_TYPE: string;
  CUST_ID: string;
  TOKEN: string;
  DRAFT_ID: string;
  HOW: string;
  JOB_INSTR: string;
}

interface CompleteReservationResponse {
  ResponseCode: number;
  ResponseText: string;
  DRAFT_ID?: string;
  RES_ID?: string;
}

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
};

export const completeReservation = async (
  params: CompleteReservationParams,
): Promise<CompleteReservationResponse> => {
  try {
    const code = CryptoJS.MD5(getFormattedDate()).toString();
    console.log("params completeReservation", params);

    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key as keyof CompleteReservationParams]);
    }

    const response = await axios.post(`${BASE_URL}/completeReservation.aspx?CODE=${code}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    
    const parser = new XMLParser();
    let jObj = parser.parse(response.data);
    const { ResponseCode, ResponseText, DRAFT_ID, RES_ID } = jObj.Response;
    
    if (ResponseCode === 200) {
      return {
        ResponseCode,
        ResponseText,
        DRAFT_ID,
        RES_ID,
      };
    } else {
      return {
        ResponseCode,
        ResponseText,
      };
    }
  } catch (error) {
    return {
      ResponseCode: 500,
      ResponseText: 'An error occurred while completing the reservation',
    };
  }
};
