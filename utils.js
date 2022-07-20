import axios from 'axios';
import fs from 'fs';
import yaml from 'js-yaml';
import { ClientCredentials } from 'simple-oauth2';
import config from './config/config.js';

const { VGS_CLIENT_ID, VGS_CLIENT_SECRET } = process.env;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function makeHeaders(accessToken, tenantId) {
  const headers = {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    Authorization: `Bearer ${accessToken}`,
  };

  if (tenantId) {
    headers['VGS-Tenant'] = tenantId;
  }

  return headers;
}

export async function fetchJSONApi(url, options) {
  const params = {
    url,
    method: options.method,
    data: options.data,
    headers: options.headers,
  };
  return axios.request(params);
}

export async function getAccessToken() {
  const oauthConfig = {
    client: {
      id: VGS_CLIENT_ID,
      secret: VGS_CLIENT_SECRET
    },
    auth: config.auth,
    options: {
      authorizationMethod: 'body'
    }
  };

  const client = new ClientCredentials(oauthConfig);

  const tokenParams = {
    scope: ['routes:write'],
  };

  try {
    const response = await client.getToken(tokenParams, {json: true});
    return response.token.access_token;
  } catch (error) {
    throw new Error(error);
  }
}

export function getRouteConfig(path = './vgs/routes.yaml') {
  if (fs.existsSync(path)) {
    return yaml.load(fs.readFileSync(path, 'utf8'));
  } else {
    return null;
  }
}
