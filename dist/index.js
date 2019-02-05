"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var camelCased = function (str) { return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); };
exports.routeComponent = function (name, component, params) {
    return {
        "name": name,
        "component": component,
        "params": params
    };
};
var Application = /** @class */ (function () {
    function Application(options, childComponents) {
        var _this = this;
        this.$ = {};
        this.events = new Map();
        this.currentModule = [];
        this.partials = new Map();
        this.addEvent = function (name, method) {
            _this.events.set(name, method);
        };
        this.fire = function (name) {
            _this.events.get(name);
        };
        this.replaceInnerHTML = function (oldDiv, html, transitions) {
            var newDiv = oldDiv.cloneNode(false);
            newDiv.innerHTML = html;
            __spread(_this.app.children).forEach(function (page) {
                console.log(page);
                page.classList.remove('loaded');
                page.style.display = 'none';
            });
            if (transitions) {
                var modules = __spread(_this.components.keys());
                modules.forEach(function (module) {
                    var targ = _this.components.get(module);
                    var element = _this.app.querySelector(targ.data.TEMPLATE_ID);
                    element.style.display = (module !== _this.lastOfArray(_this.currentModule)) ? 'none' : 'flex';
                });
                newDiv.classList.remove('loaded');
                newDiv.style.opacity = "0";
                newDiv.style.display = 'flex';
                setTimeout(function () {
                    newDiv.classList.add('loaded');
                }, 500);
            }
            else {
                newDiv.classList.remove('loaded');
                newDiv.style.opacity = "1";
                newDiv.style.display = 'flex';
            }
            oldDiv.parentNode.replaceChild(newDiv, oldDiv);
        };
        this.soyDir = options.templateDirectory;
        this.partialsDir = options.partialsDir;
        this.app = options.element || document.body;
        this.components = new Map();
        this.routes = options.routes;
        window.onpopstate = function () {
            var URIFields = _this.parseURI(window.location.pathname);
            _this.go(options.routes, URIFields);
        };
        this.singlePage(options.routes, this.parseURI(window.location.pathname));
    }
    Application.prototype.bind = function (dataToBind) {
        var _this = this;
        if (dataToBind) {
            var d_1 = { TEMPLATE_ID: '', SOY_PATH: this.partialsDir, PARTIAL: true };
            dataToBind.forEach(function (data) {
                var el = data.split(" -> ")[0].split(":")[0], template = data.split(" -> ")[0].split(":")[1], dtb = data.split(" -> ")[1];
                var obj = {};
                obj[dtb] = _this.get(dtb);
                d_1.TEMPLATE_ID = el;
                _this.$[camelCased(el)] = document.querySelector(el);
                new BaseView(Object.assign(d_1, { key: template, data: obj }), template);
            });
        }
    };
    Application.prototype.onRouteChange = function (_a) { };
    Application.prototype.parseURI = function (pathname) {
        var params = pathname.split("/").slice(2), page = pathname.split("/")[1];
        return { page: page, params: params };
    };
    Application.prototype.go = function (routes, params, transition) {
        var _this = this;
        var mtd = routes[params.page];
        var component = mtd(params.params);
        this.component(component.name, component.component, component.params, transition);
        setTimeout(function () {
            _this.onRouteChange(Object.assign({ path: window.location.pathname }, component));
            window.scrollTo(0, 0);
        }, 0);
    };
    Application.prototype.singlePage = function (routes, params) {
        var _this = this;
        this.go(routes, params, true);
        document.addEventListener('click', function (e) {
            e.preventDefault();
            if (e.target.tagName === "A") {
                e.preventDefault();
                var transition = e.target.dataset.transition === "" ? true : false;
                window.history.pushState({}, e.target.pathname, window.location.origin + e.target.pathname);
                _this.go(routes, _this.parseURI(e.target.pathname), transition);
            }
        });
    };
    Application.prototype.get = function (key) {
        return this[key];
    };
    Application.prototype.has = function (component) {
        return (this.components.get(component)) ? true : false;
    };
    Application.prototype.dom = function (id) {
        return document.createElement(id);
    };
    Application.prototype.render = function (id, template, rerender) {
        if (this.app) {
            var module_1 = this.app.querySelector("" + id);
            if (!module_1 && !template)
                this.app.appendChild(this.dom(id));
            if (module_1 && template)
                this.replaceInnerHTML(module_1, template, rerender);
        }
    };
    Application.prototype.lastOfArray = function (arr) {
        return arr[arr.length - 1];
    };
    Application.prototype.component = function (id, component, data, transition) {
        var _this = this;
        this.currentModule.push(id);
        var componentBuilt = this.has(id), helpers = {
            TEMPLATE_ID: id,
            SOY_PATH: this.soyDir
        };
        data = Object.assign(data, helpers);
        var module = componentBuilt ? this.components.get(id) : new component(data);
        if (this.currentModule && this.lastOfArray(this.currentModule) !== id)
            this.components.get(this.lastOfArray(this.currentModule)).detach();
        if (!componentBuilt) {
            this.render(id);
            this.components.set(id, module);
        }
        module.rerender(data, function (id, template, finished) {
            _this.render(id, template, transition);
            if (finished)
                finished();
        });
    };
    return Application;
}());
exports.Application = Application;
var BaseView = /** @class */ (function () {
    function BaseView(data, key) {
        var _this = this;
        this.template = null;
        this.get = function (key) { return _this.data[key]; };
        this.set = function (key, value) { return _this.data[key] = value; };
        this.element = null;
        this.data = data;
        this.key = key;
        if (data.PARTIAL) {
            this.element = document.querySelector(data.TEMPLATE_ID);
            var template = require(this.data.SOY_PATH + "/" + data.key + ".soy");
            this.element.innerHTML = template.render(Object.assign({}, { 'payload': data.data }));
        }
    }
    BaseView.prototype.ready = function () { };
    BaseView.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    BaseView.prototype.detach = function () {
        document.querySelector(this.data.TEMPLATE_ID).classList.remove('loaded');
    };
    BaseView.prototype.render = function (key, item, callback) {
        if (item)
            this.template = require(this.data.SOY_PATH + "/" + key + ".soy");
        callback(this.data.TEMPLATE_ID, this.template.render(Object.assign({}, { 'payload': item })));
    };
    BaseView.prototype.rerender = function (binded, callback) {
        var _this = this;
        this.data = binded;
        this.load().then(function (data) {
            _this.render(_this.key, data, callback);
            _this.ready();
        });
    };
    return BaseView;
}());
exports.BaseView = BaseView;
