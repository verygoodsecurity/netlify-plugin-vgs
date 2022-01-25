const {
  fetchJSONApi,
  makeHeaders,
  getAccessToken,
} = require('./utils');
const config = require('./config/config.json');

async function getRoutes(tenantId) {
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

async function updateRoute(tenantId, route) {
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

module.exports = {
  getRoutes,
  updateRoute,
}