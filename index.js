import { updateRoute, applyCollectRoute, tokenizationCollectRouteTemplate } from './routes.js';
import { getRouteConfig } from './utils.js';
import { NetlifyAPI } from 'netlify';

export const { VGS_VAULT_ID} = process.env;

export default {
  onPreBuild: async ({ constants }) => {
    console.log("[vgs-plugin] onPreBuild, vaultId:", VGS_VAULT_ID);

    const { NETLIFY_API_TOKEN, SITE_ID } = constants;
    const netlify = new NetlifyAPI(NETLIFY_API_TOKEN);

    const site = await netlify.getSite({ site_id: SITE_ID });
    const routeConfig = getRouteConfig();

    if(routeConfig) {
      console.log('[vgs-plugin] starting route update')
      await updateRoute(VGS_VAULT_ID, routeConfig);

      console.log('[vgs-plugin] route update finished!')
    }

    const collectRoute = await applyCollectRoute(VGS_VAULT_ID);

    console.log('[vgs-plugin] netlify updateSite')
    try {
      console.log('[vgs-plugin] adding env variable VGS_ROUTE_ID', collectRoute.id)

      await netlify.updateSite(
        {
          site_id: SITE_ID, 
          body: {
            build_settings: {
              env: {
                ...site.build_settings.env,
                VGS_ROUTE_ID: collectRoute.id
              }
            },
          }
      });
    } catch (e) {
      console.log('[vgs-plugin] netlify updateSite error:', e)
    }

    console.log('[vgs-plugin] netlify updateSite finished!')
  },
}
