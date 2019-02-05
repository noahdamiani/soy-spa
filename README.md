# SOY-SPA

A single page application micro-framework with routing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

You will need webpack and soy-loader to implement soy-spa. 

Example webpack-config:

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.soy$/, loader: 'soy-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'SPA',
      template: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ]
};
```

Installing soy-spa

With NPM: 

```
npm i --save git+https://git@github.com/noahdamiani/soy-spa
```

With yarn: 

```
yarn add git+https://git@github.com/noahdamiani/soy-spa
```

## Usage

Import dependencies:

```
import { Application, route, parameter, routeComponent, AppOptions  } from 'soy-spa'; 
```

Define your routes (parameters (:slug) are optional):
```
const Routes: route = {
  '': (params: paramater) => {
    return routeComponent("home-page", HomePageComponent, { slugOne: params[0], slugTwo: params[1] })
  }
};
```

Configure your Application:

```
const config: AppOptions = {
  element: document.querySelector('your-app-html-element'),
  routes: Routes, // Your defined routes.
  templateDirectory: './views', // Where your .soy page templates live.
  partialsDir: './partials'  // Where your .soy partials live (ie. header, footer).
}
```

Create the application:

```
class MyApp extends Application {
  navigation: Array<string> = ['home', 'about', 'anotherpage'];
  childComponents: Array<string> = [
    //html-element-name:soyfilename -> datatobind
    'app-header:header -> navigation', // Bind data with the -> to access MyApp.navigation
    'app-footer:footer' // Example of a partial with no data-binding
  ]

  constructor(config: AppOptions) {
    super(config);
    super.bind(this.childComponents); // Optional, leave out if you aren't using partials.
  }
}

new SoyApp(config);
```

Example component controller, use the load function to asynchronously bind data to the template.

```
import { BaseView } from "soy-spa";

interface ExampleAJAXResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean
}

export default class HomePageComponent extends BaseView {
  constructor(data: any) {
    super(data, 'homepage' //.soy template name);
  }

  async load(): Promise<ExampleAJAXResponse> {
    super.load();
    const slugOne = this.get('slugOne');
    const slugTwo = this.get('slugTwo');
    return fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => Object.assign(json, { slugOne: slugOne, slugTwo: slugTwo }));
  }
}
```

views/homepage.soy
```
{namespace views.homepage}


/**
 * Example homepage template.
 *
 */
{template .render}
   {@param? payload: ? }
   <h1>Example Homepage with async data</h1>
   {if $payload}
      UserId: {$payload.userId}
      ID: {$payload.id}
      Title: {$payload.string}
      Completed: {$payload.completed}
    {/if}
{/template}


```

## Support

Please [open an issue](https://github.com/noahdamiani/soy-spa/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/noahdamiani/soy-spa/compare/).