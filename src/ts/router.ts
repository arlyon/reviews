import {apiManager} from "./apimanager";

export interface Route {
    url: string;
    name: string;

    generator(): Promise<HTMLElement[]>;
}

enum ElementType {
    header,
    nav,
    content,
}

export class Router {

    private routes: Route[];
    private root: string;
    private header: HTMLLinkElement;
    private nav: HTMLElement;
    private content: HTMLElement;

    constructor(headerElement: HTMLLinkElement, navElement: HTMLElement, contentElement: HTMLElement, root: string) {

        this.routes = [];
        this.root = root;
        this.header = headerElement;
        this.nav = navElement;
        this.content = contentElement;

        window.onpopstate = () => {
            this.generatePage();
        }
    }

    public getCurrentUrl(): string {
        let url = this.removeSlashes(decodeURI(location.pathname + location.search));
        url = url.replace(/\?(.*)$/, '');
        url = this.root != '/' ? url.replace(this.root, '') : url;

        return this.removeSlashes(url);
    }

    private removeSlashes = (path: string) => {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    };

    public generatePage = async () => {
        return Promise.all([
            this.generateHeader(),
            this.generateNavBar(),
            this.generateContent(),
        ])
    };

    private generateHeader = async () => {
        const settings = (await apiManager.getSettings()).title;
        if (settings) this.header.innerText = settings;
        this.header.onclick = () => this.routeTo('');
    };

    private generateNavBar = async () => {
        const nav = document.createElement('nav');
        nav.id = 'nav';

        this.routes.forEach((route: Route) => {
            const navElement = document.createElement('div');
            navElement.innerHTML = route.name;
            navElement.onclick = () => {
                this.routeTo(route.url);
            };
            nav.appendChild(navElement);
        });

        this.replaceElement(ElementType.nav, Array.from(nav.children) as HTMLElement[]);
    };

    private generateContent = async () => {
        // this.content.className = 'loading';

        let matches = this.routes.filter((route: Route): boolean => {
            return this.removeSlashes(this.root + route.url) === this.getCurrentUrl();
        });

        if (matches.length === 1) {
            try {
                let pageElements = await matches[0].generator();
                this.replaceElement(ElementType.content, pageElements);
            } catch (e) {
                console.error(e);
                this.generateError(e.toString());
            }
        } else {
            this.generateError("FUCKING 404 M8");
        }

        setTimeout(() => this.content.className = '', 10)
    };

    private generateError(message: string) {
        let errorMessage = document.createElement('section');
        errorMessage.innerText = `Invalid Generator Function: ${message}`;
        this.replaceElement(ElementType.content, errorMessage);
    }

    private replaceElement = (toBeReplaced: ElementType, replacement: HTMLElement | HTMLElement[]) => {
        let element: HTMLElement;

        if (toBeReplaced == ElementType.header) element = this.header;
        else if (toBeReplaced == ElementType.nav) element = this.nav;
        else element = this.content;

        const replacementArray = replacement instanceof Array ? replacement : [replacement];
        element.innerHTML = '';

        replacementArray.forEach((newChild) => {
            element.appendChild(newChild)
        });
    };

    public addRoute = (route: Route): void => {
        this.routes.push(route);
    };

    public routeTo = (path: string) => {
        if (this.isRoute(path)) {
            history.pushState(null, path, this.root + this.removeSlashes(path));
            this.generateContent();
        }
    };

    private isRoute = (path: string) => this.routes.some(route => route.url === path);

}