import axios from 'axios';
import CryptoJS from 'crypto-js';
import {XMLParser} from 'fast-xml-parser';

interface SaveReservationResponse {
  ResponseCode: number;
  ResponseText: string;
  DRAFT_ID?: string;
}

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

interface SaveReservationParams {
  CODE: string;
  APP_TYPE: string;
  JOB_TYPE: string;
  JOB_DATE: string;
  JOB_START: string;
  JOB_DIR: string;
  JOB_CITY: string;
  JOB_STATE: string;
  JOB_ZIP?: string;
  STOP_ADDRESS: string;
  STOP_CITY: string;
  STOP_STATE: string;
  STOP_RETURN: string;
  JOB_DEST: string;
  DEST_CITY: string;
  DEST_STATE: string;
  DEST_ZIP?: string;
  RETURN?: string;
  JOB_HOURS?: string;
  JOB_INSTR?: string;
  PEOPLE: string;
  VEH_ID: string;
  VEH_RATE: string;
  TOKEN: string;
  CUST_ID: string;
}

export const saveReservation = async (
  params: SaveReservationParams,
): Promise<SaveReservationResponse> => {
  try {
    // console.log('saveReservation', params);
    // Generate the MD5 hash of today's date
    const today = getFormattedDate();
    const code = CryptoJS.MD5(today).toString();

    const debugDetail = axios.post('https://prod-101.westeurope.logic.azure.com:443/workflows/3e7694753c13431287a9faf19f0285c5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OdjHam-L1aCL-0oOr93lVpVKIBwBIerBB8cUkkWIGLY',
      {...params}
    )

    // Construct the request URL
    const queryParams = new URLSearchParams({
      CODE: code,
      APP_TYPE: params.APP_TYPE,
      JOB_TYPE: params.JOB_TYPE,
      JOB_DATE: params.JOB_DATE,
      JOB_START: params.JOB_START,
      JOB_DIR: params.JOB_DIR,
      JOB_CITY: params.JOB_CITY,
      JOB_STATE: params.JOB_STATE,
      JOB_ZIP: params.JOB_ZIP ?? '',
      STOP_ADDRESS: params.STOP_ADDRESS ?? '',
      STOP_CITY: params.STOP_CITY,
      STOP_STATE: params.STOP_STATE ?? '',
      STOP_RETURN: params.STOP_RETURN,
      JOB_DEST: params.JOB_DEST,
      DEST_CITY: params.DEST_CITY,
      DEST_STATE: params.DEST_STATE,
      DEST_ZIP: params.DEST_ZIP ?? '',
      RETURN: params.RETURN ?? '',
      JOB_HOURS: params.JOB_HOURS ?? '',
      JOB_INSTR: params.JOB_INSTR ?? '',
      PEOPLE: params.PEOPLE,
      VEH_ID: params.VEH_ID,
      VEH_RATE: params.VEH_RATE,
      TOKEN: params.TOKEN,
      CUST_ID: params.CUST_ID,
    });

    const url = `${BASE_URL}/saveReservation.aspx?${queryParams.toString()}`;

    const response = await axios.get(url);
    if (response.status === 200 && response.data) {
      const parser = new XMLParser();
      let jObj = parser.parse(response.data);
      console.log('saveReservation response', response.data);

      return {
        ResponseCode: jObj?.Response.ResponseCode,
        ResponseText: jObj?.Response.ResponseText,
        DRAFT_ID: jObj?.Response.DRAFT_ID,
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error saving reservation:', error);
    return {
      ResponseCode: 500,
      ResponseText: 'An error occurred while saving the reservation',
    };
  }
};
