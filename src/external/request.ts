import axios from "axios";
import config from "../config";


export const monoInstance = axios.create({
  baseURL: config().MONO_BASE_URL,
  headers: {
    "content-type": "application/json",
    "mono-sec-key": config().MONO_SEC_KEY,
  },
});