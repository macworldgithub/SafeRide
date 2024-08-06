import axios from 'axios';
import CryptoJS from 'crypto-js';
import { XMLParser } from 'fast-xml-parser';

interface ResponseGetReservation {
    ResponseCode: number;
    ResponseText: string;
    CUST_ID?: string;
    RES_ID?: string;
    STATUS?: string;
    JOB_TYPE?: string;
    JOB_HOURS?: string;
    JOB_DIR?: string;
    JOB_CITY?: string;
    JOB_STATE?: string;
    START_TIME?: string;
    PEOPLE?: string;
    VEH_ID?: string;
    VEH_NAME?: string;
    STOP_ADDRESS?: string;
    STOP_CITY?: string;
    STOP_STATE?: string;
    STOP_RETURN?: string;
    JOB_DEST?: string;
    DEST_CITY?: string;
    DEST_STATE?: string;
    RETURN?: string;
    VEH_RATE?: string;
    TOTAL?: string;
    AMT?: string;
    CC_TYPE?: string;
    CC_NO?: string;
    PNREF?: string;
    OP_NAME?: string;
    CO_PHONE?: string;
    APP_TYPE?: string;
  }
  

const BASE_URL = 'https://test.saferides.org/api';

const getFormattedDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
};

export const getReservation = async (
  CUST_ID: string,
  TOKEN: string,
  RES_ID: string,
): Promise<ResponseGetReservation> => {
  try {
    // Generate the MD5 hash of today's date
    const today = getFormattedDate();
    const code = CryptoJS.MD5(today).toString();

    const formData = new FormData();
    formData.append('CUST_ID', CUST_ID);
    formData.append('TOKEN', TOKEN);
    formData.append('RES_ID', RES_ID);

    const response = await axios.post(
      `${BASE_URL}/getReservationDetails.aspx?CODE=${code}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200 && response.data) {
      // Parsing XML
      const parser = new XMLParser();
      const jObj = parser.parse(response.data);

      console.log("getReservationDetails response", response);

      return {
        ResponseCode: jObj?.Response.ResponseCode,
        ResponseText: jObj?.Response.ResponseText,
        CUST_ID: jObj?.Response.CUST_ID,
        RES_ID: jObj?.Response.RES_ID,
        STATUS: jObj?.Response.STATUS,
        JOB_TYPE: jObj?.Response.JOB_TYPE,
        JOB_HOURS: jObj?.Response.JOB_HOURS,
        JOB_DIR: jObj?.Response.JOB_DIR,
        JOB_CITY: jObj?.Response.JOB_CITY,
        JOB_STATE: jObj?.Response.JOB_STATE,
        START_TIME: jObj?.Response.START_TIME,
        PEOPLE: jObj?.Response.PEOPLE,
        VEH_ID: jObj?.Response.VEH_ID,
        VEH_NAME: jObj?.Response.VEH_NAME,
        STOP_ADDRESS: jObj?.Response.STOP_ADDRESS,
        STOP_CITY: jObj?.Response.STOP_CITY,
        STOP_STATE: jObj?.Response.STOP_STATE,
        STOP_RETURN: jObj?.Response.STOP_RETURN,
        JOB_DEST: jObj?.Response.JOB_DEST,
        DEST_CITY: jObj?.Response.DEST_CITY,
        DEST_STATE: jObj?.Response.DEST_STATE,
        RETURN: jObj?.Response.RETURN,
        VEH_RATE: jObj?.Response.VEH_RATE,
        TOTAL: jObj?.Response.TOTAL,
        AMT: jObj?.Response.AMT,
        CC_TYPE: jObj?.Response.CC_TYPE,
        CC_NO: jObj?.Response.CC_NO,
        PNREF: jObj?.Response.PNREF,
        OP_NAME: jObj?.Response.OP_NAME,
        CO_PHONE: jObj?.Response.CO_PHONE,
        APP_TYPE: jObj?.Response.APP_TYPE
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return {
      ResponseCode: 500,
      ResponseText: 'An error occurred while fetching the reservations',
    };
  }
};
