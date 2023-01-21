import { ValidationErrors } from './../models/notification';
import { authServices } from "./../services/auth";
import { UserInfo, LoginArgument, GetSignatureArgs} from "./../models/auth";
import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { AxiosError } from "axios";
import { handleError } from "./notification";

interface State {
  // token: string | null;
  userInfo?: UserInfo | undefined;
  isLoginLoading: boolean;
  checkAuthenticated?: boolean;
  isGetSignatureLoading: boolean;
  signature?: string
}

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const ACTION_TYPE = 'auth/'

const initialState: State = {
  checkAuthenticated: undefined,
  userInfo: undefined,
  isLoginLoading: false,
  isGetSignatureLoading: false,
  signature: undefined
};

const setUserInfoCR: CR<{ user: UserInfo}> = (
  state,
  { payload }
) => ({
  ...state,
  userInfo: payload.user!,
});

const checkAuthenticationCR: CR<{value: boolean}> = (
  state,
  { payload }
) => ({
  ...state,
  checkAuthenticated: payload.value!
});

const login = createAsyncThunk(
  `${ACTION_TYPE}login`,
  async (args: LoginArgument, { dispatch }) => {
    try {
      const result = await authServices.login(args as LoginArgument);
      return result;
    } catch (error) {
      const err = error as AxiosError
      if(err.response?.data){
        dispatch(handleError({ errorMessage: (err.response?.data as ValidationErrors).errorMessage }));
      }
      else{
        dispatch(handleError({ errorMessage: err.message }));
      }
      throw err
    }
  }
);

const getSignature = createAsyncThunk(
  `${ACTION_TYPE}getSignature`,
  async (args: GetSignatureArgs, { dispatch }) => {
    try {
      const result = await authServices.getSignature(args as GetSignatureArgs);
      return result;
    } catch (error) {
      const err = error as AxiosError
      if(err.response?.data){
        dispatch(handleError({ errorMessage: (err.response?.data as ValidationErrors).errorMessage }));
      }
      else{
        dispatch(handleError({ errorMessage: err.message }));
      }
      throw err
    }
  }
);

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: setUserInfoCR,
    checkAuthentication: checkAuthenticationCR
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => ({
      ...state,
      isLoginLoading: true,
    }));
    builder.addCase(login.fulfilled, (state, { payload }) => {
      if(payload?.token){
        return{
          ...state,
          isLoginLoading: false,
          userInfo: jwtDecode(payload.token)
        }
      }
      return{
        ...state,
        isLoginLoading: false,
        userInfo: undefined
      }
    });
    builder.addCase(login.rejected, (state) => ({
      ...state,
      isLoginLoading: false,
    }));
    builder.addCase(getSignature.pending, (state) => ({
      ...state,
      isGetSignatureLoading: true,
    }));
    builder.addCase(getSignature.fulfilled, (state, { payload }) => ({
      ...state,
      isGetSignatureLoading: false,
      signature: payload.signature
    }));
    builder.addCase(getSignature.rejected, (state) => ({
      ...state,
      isGetSignatureLoading: false,
    }));
  },
});

export { login, getSignature };

export const { setUserInfo, checkAuthentication} = auth.actions;

export default auth.reducer;
