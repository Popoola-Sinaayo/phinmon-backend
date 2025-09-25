import axios from "axios";
import config from "../config";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

export const monoInstance = axios.create({
  baseURL: config().MONO_BASE_URL,
  headers: {
    "content-type": "application/json",
    "mono-sec-key": config().MONO_SEC_KEY,
    
  },
});


console.log(config().MONO_SEC_KEY);


const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": config().PLAID_CLIENT_ID,
      "PLAID-SECRET": config().PLAID_CLIENT_SECRET,
    },
  },
});

export const plaidInstance = new PlaidApi(plaidConfig);