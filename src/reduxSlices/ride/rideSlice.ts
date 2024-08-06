import {createSlice} from '@reduxjs/toolkit';

export interface RideDetails {
  data: {
    APP_TYPE: string;
      JOB_TYPE: string;
      JOB_DATE: string;
      JOB_START: string;
      JOB_DIR: string;
      JOB_CITY: string;
      JOB_STATE: string;
      JOB_ZIP: string;
      STOP_ADDRESS: string;
      STOP_CITY: string;
      STOP_STATE: string;
      STOP_RETURN: string;
      JOB_DEST: string;
      DEST_CITY: string;
      DEST_STATE: string;
      DEST_ZIP: string;
      RETURN: string;
      JOB_HOURS: string;
      MINUTES: string;
      JOB_INSTR: string;
      PEOPLE: string;
      VEH_ID: string;
      VEH_RATE: string;
      VEH_NAME: string;
      TOTAL: string;
      STATUS: string;
      DONATION: string;
  };
}

const initialState : RideDetails = {
  data: {
    APP_TYPE: '',
    JOB_TYPE: '',
    JOB_DATE: '',
    JOB_START: '',
    JOB_DIR: '',
    JOB_CITY: '',
    JOB_STATE: '',
    JOB_ZIP: '',
    STOP_ADDRESS: '',
    STOP_CITY: '',
    STOP_STATE: '',
    STOP_RETURN: '',
    JOB_DEST: '',
    DEST_CITY: '',
    DEST_STATE: '',
    DEST_ZIP: '',
    RETURN: '',
    JOB_HOURS: '',
    MINUTES: '',
    JOB_INSTR: '',
    PEOPLE: '',
    VEH_ID: '',
    VEH_RATE: '',
    VEH_NAME: '',
    TOTAL: '',
    STATUS:'',
    DONATION: ''
  }
};

export const rideSlice = createSlice({
  name: 'rideDetails',
  initialState: initialState,
  reducers: {
    setRideData: (state, action) => {
      console.log('State provided to store', action.payload);
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    clearRideData: (state) => {
      console.log("rideDetails reset");
      state.data = initialState.data;
    },
  },
});

export const {setRideData, clearRideData} = rideSlice.actions;

export default rideSlice.reducer;
