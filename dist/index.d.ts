/**
 * Parameter index signatures
 */
export interface parameter {
    [key: string]: any;
}
/**
 * Application options
 */
export interface AppOptions {
    element: Element | null;
    routes: route;
    templateDirectory: string;
    partialsDir: string;
    debug?: Boolean;
}
/**
 * Routed component structure
 */
interface componentRoute {
    name: string;
    component: any;
    params: Array<any>;
}
export declare const routeComponent: (name: string, component: any, params?: any) => componentRoute;
/**
 * Interfaces for routes and the local DOM
 */
export interface route {
    [key: string]: Function;
}
export interface localDOM {
    [key: string]: Element | null;
}
/**
 *
 * Main application code. Handles components and routing.
 *
 */
export declare class Application {
    [key: string]: any;
    $: localDOM;
    app: Element | null;
    currentModule: Array<string>;
    components: Map<string, any>;
    events: Map<string, Function>;
    partials: Map<string, BaseView>;
    partialsDir: string;
    routes: route;
    soyDir: string;
    constructor(options: AppOptions);
    /**
     * Binds partials to the application.
     *
     * @param dataToBind The child components to bind
     *
     */
    protected bind(dataToBind: Array<string>): void;
    /**
     * Defines the onRouteChange method to be accessed by new Applications
     */
    protected onRouteChange({}: {}): void;
    /**
     * Takes a URI and gives back the page name and parameters
     *
     * @param pathname The window pathname
     *
     */
    parseURI(pathname: string): {
        page: string;
        params: string[];
    };
    /**
     *
     * Fires routing to components.
     *
     * @param routes The application's routes.
     * @param params The parameters of the route to navigate to.
     * @param transition Optional transitions on anchor click.
     *
     */
    go(routes: route, params?: any, transition?: boolean): void;
    /**
     * Initializes routing by firing the initial routing function
     * Overrides default anchor href functionality with preventDefault
     * and pushState
     *
     * @param routes The application's routes.
     * @param params The parameters of the route to navigate to.
     */
    singlePage(routes: route, params: any): void;
    /**
     * Allows adding of global application events
     *
     * @param name Event name.
     * @param method Event method.
     */
    addEvent(name: string, method: Function): void;
    /**
     * Fires a global application event.
     *
     * @param name Event to fire.
     */
    fire(name: string): void;
    /**
     * Gets a property value on the application class by key.
     *
     * @param key Property on application to be accessed.
     */
    get(key: string): any;
    /**
     * Checks if a component exists by ID.
     *
     * @param component The component to check.
     */
    has(component: string): boolean;
    /**
     * Creates a DOM element.
     *
     * @param elementTagName The element tagname.
     */
    dom(elementTagName: string): HTMLElement;
    /**
     *
     * Renders the component in the DOM
     *
     * @param id The component ID to render.
     * @param template The component's template string.
     * @param rerender Condition for render vs. rerender.
     */
    render(id: string, template?: string, rerender?: boolean): void;
    /**
     * Helper function to get last item of an array.
     *
     * @param arr Array to query.
     */
    lastOfArray(arr: Array<string>): string;
    /**
     * Registers a component in the application.
     *
     * @param id The component identifier.
     * @param component The component constructor.
     * @param data The data to bind to the registered component.
     * @param transition Tracks whether DOM transitions are on or not.
     */
    component(id: string, component: any, data: any, transition?: boolean): void;
    /**
     *
     * Inserts the new template into the DOM
     *
     * @param oldDiv The previous component element
     * @param html The new HTML string to append
     * @param transitions Optional css transition support
     */
    replaceInnerHTML(oldDiv: Element, html: string, transitions?: boolean): void;
}
/**
 * Component base logic.
 */
export declare class BaseView {
    element: HTMLDivElement | null;
    data: any;
    template: any;
    key: string;
    constructor(data: any, key: string);
    /**
     * Fires after component is rendered.
     */
    protected ready(): void;
    /**
     * Async function that is fired on render.
     * The returned value is binded to the template.
     */
    protected load(): Promise<any>;
    protected detach(): void;
    /**
     * Setter and Getter
     */
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    /**
     *
     * Renders the component.
     *
     * @param key Component identifier.
     * @param item Data to bind.
     * @param callback Callback to fire when finished.
     */
    render(key: string, item: any, callback: Function): void;
    /**
     *
     * Rerender an already built component.
     *
     * @param binded The new data to bind.
     * @param callback Callback to fire after binded.
     */
    rerender(binded: any, callback: Function): void;
}
export {};
