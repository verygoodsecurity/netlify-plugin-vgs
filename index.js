const { updateRoute } = require('./routes');
const { getRouteConfig } = require('./utils');


const { VGS_VAULT_ID} = process.env;

module.exports = {
  onPreBuild: async (params) => {
    console.log("[vgs-plugin] onPreBuild, vaultId:", VGS_VAULT_ID)
    const routeConfig = getRouteConfig();

    if(routeConfig) {
      console.log('[vgs-plugin] starting route update')
      await updateRoute(VGS_VAULT_ID, routeConfig);

      console.log('[vgs-plugin] route update finished!')
    }
  },
}