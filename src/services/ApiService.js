import axios from 'axios';
import {ApiBaseUrlDev, ApiBaseUrlPrd} from '../constants/Environment';

const api = axios.create({
  baseURL: ApiBaseUrlPrd,
  // baseURL: ApiBaseUrlDev,
});

export default api;
