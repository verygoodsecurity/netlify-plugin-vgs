const axios = require('axios');
const fs = require('fs')
const yaml = require('js-yaml');
const config = require('./config/config.json');

const { VGS_CLIENT_ID, VGS_CLIENT_SECRET } = process.env;
const { ClientCredentials } = require('simple-oauth2');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function makeHeaders(accessToken, tenantId) {
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

async function fetchJSONApi(url, options) {
  const params = {
    url,
    method: options.method,
    data: options.data,
    headers: options.headers,
  };
  return axios.request(params);
}

async function getAccessToken() {
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

function getRouteConfig(path = './vgs/routes.yaml') {
  if (fs.existsSync(path)) {
    return yaml.load(fs.readFileSync(path, 'utf8'));
  } else {
    return null;
  }
}

module.exports = {
  getRouteConfig,
  makeHeaders,
  fetchJSONApi,
  getAccessToken,
}