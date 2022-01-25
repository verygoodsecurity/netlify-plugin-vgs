# VGS Plugin for Netlify (alpha version)
The plugin lets you update VGS routes at the same time as your site deployments, which make your deployments idempotent.
[Example project](https://github.com/verygoodsecurity/netlify-plugin-example)

## Project Setup

1. First, you will need to create a VGS account [here](https://dashboard.verygoodsecurity.com)
2. Then, create a simple index.html file with a form:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VGS <-> Netlify Plugin demo</title>
</head>
<body>
  <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact" />
    <p>
      <label>Your Name: <input type="text" name="name" /></label>   
    </p>
    <p>
      <button type="submit">Send</button>
    </p>
  </form>
</body>
</html>
```

## Add VGS plugin

1. Add the following line to your `netlify.toml` file:

```toml
[[plugins]]
  package = "@vgs/netlify-plugin-vgs"
```

2. Install plugin from npm
```bash
npm install -D @vgs/netlify-plugin-vgs
```

## Add VGS routes config file

You may get it from VGS Dashboard (Routes -> Export as YAML) or paste the following snippet (in the future, we'll automate this, but for now make sure to fill your site URL in the `destination_override_endpoint` YAML field):

```yaml
data:
  - attributes:
      created_at: '2022-01-24T19:52:20'
      destination_override_endpoint: 'https://vgs-plugin.netlify.app'
      entries:
        - classifiers: {}
          config:
            condition: AND
            rules:
              - expression:
                  field: PathInfo
                  operator: equals
                  type: string
                  values:
                    - /
              - expression:
                  field: ContentType
                  operator: equals
                  type: string
                  values:
                    - application/x-www-form-urlencoded
          id: f85c9bb8-2a75-40b9-9824-c845e0678dc6
          id_selector: null
          operation: REDACT
          operations: null
          phase: REQUEST
          public_token_generator: UUID
          targets:
            - body
          token_manager: PERSISTENT
          transformer: FORM_FIELD
          transformer_config:
            - name
          transformer_config_map: null
      host_endpoint: (.*)\.verygoodproxy\.com
      id: d73cc233-c00c-4428-a7bc-f30022f41978
      ordinal: null
      port: 80
      protocol: http
      source_endpoint: '*'
      tags:
        name: hello from netlify!
        source: RouteContainer
      updated_at: '2022-01-25T13:52:02'
    id: d73cc233-c00c-4428-a7bc-f30022f41978
    type: rule_chain
version: 1
```

Now, your directory structure should look like this:
```
your-app
├─ ...
├─ vgs
|  └─ routes.yaml
├─ netlify.toml
├─ package.json
└─ index.html
```

## Create VGS credentials

Here is a [detailed guide](https://www.verygoodsecurity.com/docs/vgs-cli/service-account) on how to do it. In the end, you'll have 2 variables: `VGS_CLIENT_ID` and `VGS_CLIENT_SECRET`

## Get your VGS Vault Id
Copy it from your Vault page on [VGS Dashboard](https://dashboard.verygoodsecurity.com)


https://user-images.githubusercontent.com/455045/150997930-37a7825d-83f0-4a45-8a13-e616af7cb199.mov


## Add ENV variables in the Netlify Dashboard

Go to Site Settings -> Build & deploy -> Environment and add those 3 variables:
```
VGS_CLIENT_ID=
VGS_CLIENT_SECRET=
VGS_VAULT_ID=
```
