import axios from 'axios';
import {ApiBaseUrlDev, ApiBaseUrlPrd} from '../constants/InovaEnvironment';

const api = axios.create({
  // baseURL: ApiBaseUrlDev,
  baseURL: ApiBaseUrlPrd,
});

export default api;
