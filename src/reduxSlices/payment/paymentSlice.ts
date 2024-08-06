import {createSlice} from '@reduxjs/toolkit';

export interface PaymentState {
  data: {
    CUST_ID?: string;
    ResponseCode?: number;
    ResponseText?: string;
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
}

const initialState: PaymentState = {
  data: {
    CUST_ID: '',
    ResponseCode: 0,
    ResponseText: '',
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
  },
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentData: (state, action) => {
      console.log('State provided to store', action.payload);
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    clearPaymentData: state => {
      state.data = initialState.data;
    },
  },
});

export const {setPaymentData, clearPaymentData} = paymentSlice.actions;

export default paymentSlice.reducer;
