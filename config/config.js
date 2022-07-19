export default {
  "vaultApiUrl": "https://api.sandbox.verygoodsecurity.com",
  "auth": {
    "tokenHost": "https://auth.verygoodsecurity.com",
    "tokenPath": "/auth/realms/vgs/protocol/openid-connect/token",
    "authorizePath": "/auth/realms/vgs/protocol/openid-connect/auth"
  },
  "defaultRuleTokenizeHostEndpoint": "(.*)\\.verygoodproxy\\.com",
  "defaultRuleTokenizeHostOverrideEndpoint": "https://api.sandbox.verygoodvault.com",
  "tokenizationAPIHostname": "api.sandbox.verygoodvault.com",
}