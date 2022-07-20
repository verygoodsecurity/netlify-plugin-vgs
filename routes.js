// const {
//   fetchJSONApi,
//   makeHeaders,
//   getAccessToken,
// } = require('./utils');
// const config = require('./config/config.json');

import { 
  fetchJSONApi,
  makeHeaders,
  getAccessToken,
 } from './utils.js'
import config from './config/config.js'

export async function getRoutes(tenantId) {
  const accessToken = await getAccessToken();
  const url = `${config.vaultApiUrl}/rule-chains`;
  const params = {
    method: 'GET',
    headers: makeHeaders(accessToken, tenantId),
  };

  try {
    const response = await fetchJSONApi(url, params);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateRoute(tenantId, route) {
  console.log('[vgs-plugin] updating route', route.data[0].id)
  const accessToken = await getAccessToken();
  const url = `${config.vaultApiUrl}/rule-chains/${route.data[0].id}`;
  const params = {
    method: 'PUT',
    headers: makeHeaders(accessToken, tenantId),
    data: {
      data: route.data[0]
    },
  };

  try {
    const response = await fetchJSONApi(url, params);
    console.log('[vgs-plugin] route updated', route.data[0].id)
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
}

export const tokenizationCollectRouteTemplate = {
  id: '7f0c8bd9-4f67-4a49-a7b3-ade97657a1c0',
  destination_override_endpoint: config.defaultRuleTokenizeHostOverrideEndpoint,
  entries: [],
  host_endpoint: config.defaultRuleTokenizeHostEndpoint,
  port: 80,
  protocol: 'http',
  source_endpoint: '*',
  transport: 'HTTP',
  tags: {
    name: 'collect.js',
    source: 'tokenizationCollect',
  },
};

export async function createRoute(tenantId, routeData) {
  console.log('[vgs-plugin] creating route')
  const accessToken = await getAccessToken();
  const url = `${config.vaultApiUrl}/rule-chains`;

  const params = {
    method: 'POST',
    headers: makeHeaders(accessToken, tenantId),
    data: {
      data: {
        attributes: routeData,
        type: 'rule-chains',
      }
    }
  };

  try {
    const response = await fetchJSONApi(url, params);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function applyCollectRoute(vaultId) {
  const routesList = await getRoutes(vaultId);
  console.log('[vgs-plugin] routesList:', routesList);
  const collectRouteExists = !!routesList.find(route => route?.attributes?.tags?.source === 'tokenizationCollect');
  console.log('[vgs-plugin] collectRouteExists:', collectRouteExists);

  if(!collectRouteExists) {
    console.log('[vgs-plugin] there is no collect route, creating one')
    await createRoute(vaultId, tokenizationCollectRouteTemplate);
    console.log('[vgs-plugin] route creation finished!')
  }
}
