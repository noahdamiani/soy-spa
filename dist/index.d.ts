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
export declare const routeComponent: (name: string, component: any, params?: any) => componentRoute;
export interface route {
    [key: string]: Function;
}
export interface localDOM {
    [key: string]: Element | null;
}
export declare class Application {
    [key: string]: any;
    $: localDOM;
    app: Element | null;
    soyDir: string;
    partialsDir: string;
    components: Map<string, any>;
    domRef?: HTMLDivElement;
    events: Map<string, Function>;
    routes: route;
    currentModule: Array<string>;
    partials: Map<string, BaseView>;
    constructor(options: AppOptions, childComponents?: Array<string>);
    protected bind(dataToBind: Array<string>): void;
    protected onRouteChange({}: {}): void;
    parseURI(pathname: string): {
        page: string;
        params: string[];
    };
    go(routes: route, params?: any, transition?: boolean): void;
    singlePage(routes: route, params: any): void;
    addEvent: (name: string, method: Function) => void;
    get(key: string): any;
    fire: (name: string) => void;
    has(component: string): boolean;
    dom(id: string): HTMLElement;
    render(id: string, template?: string, rerender?: boolean): void;
    lastOfArray(arr: Array<string>): string;
    component(id: string, component: any, data: any, transition?: boolean): void;
    replaceInnerHTML: (oldDiv: Element, html: string, transitions?: boolean | undefined) => void;
}
export declare class BaseView {
    element: HTMLDivElement | null;
    data: any;
    template: any;
    key: string;
    constructor(data: any, key: string);
    protected ready(): void;
    protected load(): Promise<any>;
    protected detach(): void;
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    render(key: string, item: any, callback: Function): void;
    rerender(binded: any, callback: Function): void;
}
export {};
