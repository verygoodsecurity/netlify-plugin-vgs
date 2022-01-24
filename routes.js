const {
  fetchJSONApi,
  makeHeaders,
  getAccessToken,
} = require('./utils');

const vaultApiUrl = 'https://api.sandbox.verygoodsecurity.com';

async function getRoutes(tenantId) {
  const accessToken = await getAccessToken();
  const url = `${vaultApiUrl}/rule-chains`;
  const params = {
    method: 'GET',
    headers: makeHeaders(accessToken, tenantId),
  };

  try {
    const response = await fetchJSONApi(url, params);
    return response.data.data;
  } catch (error) {
    console.log('getRoutes error', error);
  }
}

async function createRoute(vaultApiUrl, tenantId, route, refreshToken) {
  const accessToken = await getAccessToken(refreshToken);

  const url = `${vaultApiUrl}/rule-chains`;
  const params = {
    method: 'POST',
    headers: makeHeaders(accessToken, tenantId),
    data: route,
  };
  const response = await fetchJSONApi(url, params);

  return response.data.data;
}

async function updateRoute(tenantId, route) {
  console.log('updateRoute', route.data[0])
  const accessToken = await getAccessToken();
  const url = `${vaultApiUrl}/rule-chains/${route.data[0].id}`;
  const params = {
    method: 'PUT',
    headers: makeHeaders(accessToken, tenantId),
    data: {
      data: route.data[0]
    },
  };

  try {
    const response = await fetchJSONApi(url, params);
    return response.data.data;
  } catch (error) {
    console.log('updateRoute error', error.response.data);
  }
}

module.exports = {
  getRoutes,
  updateRoute,
  createRoute,
}