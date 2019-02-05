# SOY-SPA

A single page application micro-framework with routing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Download to your project directory, add `README.md`, and commit:

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
  routes: Routes,
  templateDirectory: './views',
  partialsDir: './partials' 
}
```

Create the application:

```
class MyApp extends Application {
  navigation: Array<string> = ['home', 'about', 'anotherpage'];
  childComponents: Array<string> = [
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

## Support

Please [open an issue](https://github.com/noahdamiani/soy-spa/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/noahdamiani/soy-spa/compare/).