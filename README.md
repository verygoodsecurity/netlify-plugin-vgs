# VGS Plugin for Netlify

The plugin makes your integration with VGS smoother by helping with:
- configuring your vault routes with collect.js confguration
- applying all routes from `vgs/routes.yaml` file, so they will be updated with each netlify deployment.

[Example project](https://github.com/verygoodsecurity/netlify-plugin-example)

## Prerequisites
1. [VGS Dashboard account](https://dashboard.verygoodsecurity.com)
2. [VGS CLI service account](https://www.verygoodsecurity.com/docs/development/vgs-git-flow/#1-provision-a-service-account)
3. [Netlify Account](https://www.netlify.com/)
4. [Netlify CLI](https://docs.netlify.com/cli/get-started/)

## Overview
In this guide, we cover:
- How to install and use vgs-netlify-plugin
- How to setup local development environment and work with netlify/VGS collect

## Configure Netlify

First, get `clientId` and `clientSecret` credentials by following [this guide]([VGS CLI service account](https://www.verygoodsecurity.com/docs/development/vgs-git-flow/#1-provision-a-service-account))
Then, get the ID of your vault `vaultId` in the [VGS Dashboard](https://dashboard.verygoodsecurity.com)

Finally, let's create environment variables on the Netlify side, so they will be available during each build (go to the Platform section and copy it from the top of the page)
```bash
netlify env:set VGS_CLIENT_ID <clientId>
netlify env:set VGS_CLIENT_SECRET <clientSecret>
netlify env:set VGS_VAULT_ID <vaultId>
```

## Source Code
First, create a folder and initialize netlify site by running:
```bash
netlify init
```

Create a simple `src/index.html` file with a form:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VGS <-> Netlify Plugin demo</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <form id="vgs-collect-form">
    <label>Email</label>
    <div id="email" class="form-field"></div>
    <label>Password</label>
    <div id="password" class="form-field"></div>
    <button type="submit">Log in</button>
  </form>
  <script src="https://js.verygoodvault.com/vgs-collect/2.14.0/vgs-collect.js"></script>
  <script type="module" src="app.js"></script>
</body>
</html>
```

Add some styles to `src/style.css` file
```css
* {
  box-sizing: border-box;
}

html {
  font-size: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI";
}

iframe {
  width: 100%;
  height: 100%;
}

form {
  width: 400px;
  margin: 20px auto;
}

label {
  display: inline-block;
  font-size: 1.2rem;
  margin-bottom: .6rem;
  text-transform: uppercase;
}

.form-field {
  width: 100%;
  height: 4rem;
  position: relative;
  margin-bottom: 1.6rem;
  border-radius: 4px;
  box-shadow: 0 0 3px 0px #bcbcbc;
  padding: 0 10px;
  border: 1px solid transparent;
}

.form-field-group {
  display: flex;
  flex-flow: wrap;
}

.form-field-group div {
  flex: 0 0 50%;
}

.form-field-group div:first-child div {
  border-radius: 4px 0 0 4px;
  clip-path: inset(-3px 0px -3px -3px);
}

.form-field-group div:last-child div {
  border-radius: 0 4px 4px 0;
}

button[type="submit"] {
  width: 100%;
  color: white;
  background-color: #1890FF;
  margin-top: 1.6rem;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI";
  font-size: 1.4rem;
  height: 4rem;
  font-weight: 400;
  text-align: center;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
}

.form-field.vgs-collect-container__focused {
  border-color: #1890FF;
}

.form-field-group .form-field.vgs-collect-container__focused {
  clip-path: none;
}
```

and `src/app.js`, which initializes the collect.js library. Take a look at env vars:
- `process.env.VGS_VAULT_ID` - it contains vaultId we've added to netlify previously
- `process.env.VGS_ROUTE_ID` - this one will be created automatically by the plugin during deployment.

```js
const vgsForm = VGSCollect.create(
  process.env.VGS_VAULT_ID,
  'sandbox',
  (state) => {}).setRouteId(process.env.VGS_ROUTE_ID);

const css = {
  boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
  color: '#000000',
  '&::placeholder': {
    color: '#bcbcbc'
  }
};

vgsForm.field('#email', {
  type: 'text',
  name: 'login_email',
  placeholder: 'e.g. test@example.com',
  validations: ['required'],
  css
});

vgsForm.field('#password', {
  type: 'password',
  name: 'login_password',
  validations: ['required'],
  placeholder: 'password',
  css
});

document.getElementById('vgs-collect-form').addEventListener('submit', (e) => {
  e.preventDefault();
  vgsForm.tokenize((status, response) => {
    if (status === 200) {
      /**
       * Retrieve tokens from the response and send them to your server.
       */
      console.log(response);
    }
  }, (error) => {
    console.log(error);
  });
});
```

Now, create `netlify.toml` file with the following contents:
```toml
[build]
  publish = "dist/"
  command = "npm run build"

[dev]
  command = "npm start"

[[plugins]]
  package = "@vgs/netlify-plugin-vgs"
```


And the last thing, create a `package.json` file, it should contain:
- the plugin itself `@vgs/netlify-plugin-vgs`
- `parcel` to help with the build process
- an entry point declaration `"source": "src/index.html"`:
```json
{
  "name": "netlify-plugin-example",
  "version": "1.0.0",
  "source": "src/index.html",
  "scripts": {
    "start": "parcel",
    "build": "parcel build"
  },
  "devDependencies": {
    "@vgs/netlify-plugin-vgs": "0.0.4",
    "parcel": "^2.6.2"
  }
}
```

and install dependencies by running
```bash
npm install
```


Now, your directory structure should look like this:

```
your-app
├─ ...
├─ src
| |─ index.html
| |─ style.css
| └─ app.js
├─ netlify.toml
└─ package.json
```
## Start local server
Now, you are ready to start the development server, you can do it by running. It will build your app and open the browser with your running app at `http://localhost:8888`
```bash
netlify build && netlify dev
```

## Deploy to production
This command will build and deploy your code to production. In the output you will find a public URL with your app. 
```bash
netlify build && netlify deploy --production
```
