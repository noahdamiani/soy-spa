const camelCased = (str: string) => str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

export interface parameter {
  [key: string]: any;
}

export interface AppOptions {
  element: Element | null;
  routes: route;
  templateDirectory: string;
  debug?: Boolean;
  partialsDir: string;
}

interface componentRoute {
  name: string;
  component: any;
  params: Array<any>;
}

export const routeComponent = (name: string, component: any, params?: any) => {
  return <componentRoute>{
    "name": name,
    "component": component,
    "params": params
  }
}

export interface route {
  [key: string]: Function;
}

export interface localDOM {
  [key: string]: Element | null;
}

export class Application {
  [key: string]: any;
  $: localDOM = {};
  app: Element | null;
  soyDir: string;
  partialsDir: string;
  components: Map<string, any>;
  domRef?: HTMLDivElement;
  events: Map<string, Function> = new Map();
  routes: route;
  currentModule: Array<string> = [];
  partials: Map<string, BaseView> = new Map();

  constructor(options: AppOptions, childComponents?: Array<string>) {
    this.soyDir = options.templateDirectory;
    this.partialsDir = options.partialsDir;
    this.app = options.element || document.body;
    this.components = new Map();
    this.routes = options.routes;

    window.onpopstate = () => {
      const URIFields = this.parseURI(window.location.pathname);
      this.go(options.routes, URIFields);
    };
    
    this.singlePage(options.routes, this.parseURI(window.location.pathname));
  }

  protected bind(dataToBind: Array<string>) {
    if (dataToBind) {
      let d = { TEMPLATE_ID: '', SOY_PATH: this.partialsDir, PARTIAL: true }
      dataToBind.forEach((data: string) => {
        const el = data.split(" -> ")[0].split(":")[0],
          template = data.split(" -> ")[0].split(":")[1],
          dtb = data.split(" -> ")[1]
        const obj: any = {};
        obj[dtb] = this.get(dtb);
        d.TEMPLATE_ID = el;
        this.$[camelCased(el)] = document.querySelector(el);
        new BaseView(Object.assign(d, { key: template, data: obj }), template);
      })
    }
  }

  protected onRouteChange({}) {}

  parseURI(pathname: string) {
    const params = pathname.split("/").slice(2),
          page = pathname.split("/")[1]
    return { page: page, params: params };
  }

  go(routes: route, params?: any, transition?: boolean) {
    const mtd = routes[params.page];
    const component = mtd(params.params);
    this.component(component.name, component.component, component.params, transition);
    setTimeout(() => {
      this.onRouteChange(Object.assign({ path: window.location.pathname }, component))
      window.scrollTo(0, 0); 
    }, 0);
  }

  singlePage(routes: route, params: any) {
    this.go(routes, params, true);
    document.addEventListener('click', (e: any) => {
      e.preventDefault();
      if (e.target.tagName === "A") {
        e.preventDefault();
        const transition = e.target.dataset.transition === "" ? true : false;
        window.history.pushState({}, e.target.pathname, window.location.origin + e.target.pathname);
        this.go(routes, this.parseURI(e.target.pathname), transition);
      }
    })
  }

  addEvent = (name: string, method: Function) => {
    this.events.set(name, method);
  }

  get(key: string) {
    return this[key];
  } 

  fire = (name: string) => {
    this.events.get(name);
  }

  has(component: string) {
    return (this.components.get(component)) ? true : false;
  }

  dom(id: string) {
    return document.createElement(id);
  }

  render(id: string, template?: string, rerender?: boolean) {
    if(this.app) {
      const module = this.app.querySelector(`${id}`);
      if (!module && !template)
        this.app.appendChild(this.dom(id))
      if (module && template)
        this.replaceInnerHTML(module, template, rerender);
    }
  }

  lastOfArray(arr: Array<string>) {
    return arr[arr.length - 1];
  }

  component(id: string, component: any, data: any, transition?: boolean) {
    this.currentModule.push(id);
    const componentBuilt = this.has(id),
      helpers = { 
        TEMPLATE_ID: id,
        SOY_PATH: this.soyDir
      }     
    data = Object.assign(data, helpers);
    const module: BaseView = componentBuilt ? this.components.get(id) : new component(data);

    if (this.currentModule && this.lastOfArray(this.currentModule) !== id) 
      this.components.get(this.lastOfArray(this.currentModule)).detach()

    if (!componentBuilt) {
      this.render(id);
      this.components.set(id, module);
    }

    module.rerender(data, (id: string, template: string, finished?: Function) => {
      this.render(id, template, transition);
      if(finished) finished();
    });
  }
  
  replaceInnerHTML = (oldDiv: Element, html: string, transitions?: boolean) => {
    var newDiv = <HTMLElement>oldDiv.cloneNode(false);
    newDiv.innerHTML = html;
    [...this.app!.children].forEach((page) => {
      console.log(page);
      page.classList.remove('loaded');
      (page as HTMLElement).style.display = 'none';
    })
    if (transitions) {
      const modules = [...this.components.keys()];
      modules.forEach(module => {
        const targ = this.components.get(module);
        const element = this.app!.querySelector(targ.data.TEMPLATE_ID);
        element.style.display = (module !== this.lastOfArray(this.currentModule)) ? 'none' : 'flex';
      });
      newDiv.classList.remove('loaded');
      newDiv.style.opacity = "0";
      newDiv.style.display = 'flex';
      setTimeout(() => {
        newDiv.classList.add('loaded');
      }, 500);
    } else {
      newDiv.classList.remove('loaded');
      newDiv.style.opacity = "1";
      newDiv.style.display = 'flex';
    }
    oldDiv.parentNode!.replaceChild(newDiv, oldDiv);
  }
}

export class BaseView {
  element: HTMLDivElement | null;
  data: any;
  template: any = null;
  key: string;

  constructor(data: any, key: string) {
    this.element = null;
    this.data = data;
    this.key = key;
    
    if (data.PARTIAL) {
      this.element = document.querySelector(data.TEMPLATE_ID);
      const template = require(`../../../${this.data.SOY_PATH}/${data.key}.soy`);
      this.element!.innerHTML = template.render(Object.assign({}, { 'payload': data.data }));
    }
  }

  protected ready() { }
  protected async load(): Promise<any> { }
  protected detach() {
    document.querySelector(this.data.TEMPLATE_ID).classList.remove('loaded');
  }

  get = (key: string) => this.data[key];
  set = (key: string, value: any) => this.data[key] = value;

  render(key: string, item: any, callback: Function) {
    if (item) this.template = require(`../../../${this.data.SOY_PATH}/${key}.soy`);
    callback(this.data.TEMPLATE_ID, this.template.render(Object.assign({}, { 'payload': item })));
  }
  rerender(binded: any, callback: Function) {
    this.data = binded;
    this.load().then((data: any) => {
      this.render(this.key, data, callback);
      this.ready();
    });
  }
}
