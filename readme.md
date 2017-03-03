# Angularjs-Plate

Angular 1 Boilerplate (with functional & end to end tests)

![alt tag](https://media.giphy.com/media/uGlLP7Ze3pPAk/giphy.gif)

# Setup:

Note: (Install .editorconfig package for your IDE)

```shell
$ npm i
````

# Development:
```shell
$ gulp
````

# Production
```shell
$ NODE_ENV=prod gulp build
````

# Functional Tests
```shell
$ npm run test:fn
````

# E2E Tests
```shell
$ npm run webdriver-start
$ npm run test:e2e
````

# Features:
* Single JS file containing the vendorFiles, html partials and scripts
* Vendor JS & Stylus managed within package.json settings
* John Papa Angualr1 style guide
* Watches and re-loads all files
