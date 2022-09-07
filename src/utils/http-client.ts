import { useSelector } from "../hooks/use-selector";
import { apiPaths } from "./api-paths";
import React from "react";
import axios, { Method, AxiosResponse, ResponseType } from "axios";
import store, { RootState } from "../store";
import useAuth from "../hooks/use-auth";

interface Options {
  url: string;
  params?: object;
  contentType?: string;
  responseType?: ResponseType;
  data?: object | string;
  signal?: AbortSignal;
  token?: string | null;
}

interface FullOptions extends Options {
  method: Method;
}

const request = (args: FullOptions): Promise<AxiosResponse> => {
  const {
    url,
    method,
    contentType = "application/json",
    params,
    responseType = "json",
    data,
    signal,
  } = args;

  const source = axios.CancelToken.source();
  if (signal) {
    signal.addEventListener("abort", () => {
      source.cancel();
    });
  }

  // const { token } = mapStatetoProp(store.getState());
  // const { token } = store.getState().auth;

  return axios.request({
    url,
    method,
    headers: {
      contentType: contentType,
      // Authorization: `Bearer ${getReduxState}`,
    },
    data,
    responseType,
    cancelToken: source.token,
  });
};

export const httpClient = {
  get: (args: Options): Promise<AxiosResponse> => {
    return request({ ...args, method: "GET" });
  },
  put: (args: Options): Promise<AxiosResponse> => {
    return request({ ...args, method: "PUT" });
  },
  post: (args: Options): Promise<AxiosResponse> => {
    return request({ ...args, method: "post" });
  },
  patch: (args: Options): Promise<AxiosResponse> => {
    return request({ ...args, method: "PATCH" });
  },
  delete: (args: Options): Promise<AxiosResponse> => {
    return request({ ...args, method: "DELETE" });
  },
};
