import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    pureHeaders: boolean;
  }
}

axios.interceptors.request.use((config) => {
  config.timeout = 1800000;
  config.timeoutErrorMessage = 'Request timed out';
  return config;
});
