import axios from 'axios';
import CryptoJS from 'crypto-js';
import { XMLParser } from 'fast-xml-parser';

interface ReservationParams {
  CODE: string;
  CUST_ID: string;
  TOKEN: string;
  RES_TIME: string; 
}

interface Reservation {
  RES_ID: string;
  JOB_TYPE: string;
  START_TIME: string;
  JOB_DIR: string;
  JOB_CITY: string;
  JOB_STATE: string;
  JOB_DEST: string;
  DEST_CITY: string;
  DEST_STATE: string;
  PEOPLE: string;
  VEH_ID: string;
  VEH_NAME: string;
}

interface GetReservationsResponse {
  ResponseCode: number;
  ResponseText: string;
  RESERVATIONS?: XmlResGetRes[];
}

interface XmlResGetRes { 
    COUNT: number, 
    RESERVATION: Reservation[], 
    RES_TIME: string 
  }

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
};

export const getReservations = async (params: ReservationParams): Promise<GetReservationsResponse> => {
  try {
    const { CUST_ID, TOKEN, RES_TIME } = params;
    const code = CryptoJS.MD5(getFormattedDate()).toString();

    const response = await axios.get(`${BASE_URL}/getReservations.aspx?CODE=${code}&CUST_ID=${CUST_ID}&TOKEN=${TOKEN}&RES_TIME=${RES_TIME}`);

    const parser = new XMLParser();
    const jObj = parser.parse(response.data);
    const { ResponseCode, ResponseText, RESERVATIONS } = jObj.Response;

    if (ResponseCode === 200) {
      const reservations: XmlResGetRes[] = Array.isArray(RESERVATIONS) ? RESERVATIONS : [RESERVATIONS];
      return {
        ResponseCode,
        ResponseText,
        RESERVATIONS: reservations,
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
      ResponseText: 'An error occurred while retrieving reservations',
    };
  }
};
