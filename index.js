const { updateRoute } = require('./routes');
const { getRouteConfig } = require('./utils');


const { VGS_VAULT_ID} = process.env;

module.exports = {
  onPreBuild: async (params) => {
    console.log("hello from vgs!")
    const routeConfig = getRouteConfig();

    if(routeConfig) {
      console.log('starting route update')
      const res = await updateRoute(VGS_VAULT_ID, routeConfig);

      console.log('route update finished!', res)
    }
  },
}