import '../style/main.styl';
import {Route, Router} from "./router";
import {populateTemplate} from "./templatelib";

import * as root from "../templates/root.html";
import {apiManager, Modules, Module} from "./apimanager";
import {IReview} from "./objects/review";
import {Book, IBook} from "./objects/book";
import {IPlace, Place} from "./objects/place";

let header = document.getElementById("header") as HTMLLinkElement;
let nav = document.getElementById("nav") as HTMLElement;
let content = document.getElementById("content") as HTMLElement;

/**
 * Sets up the router.
 * @returns {Promise<void>}
 */
const initializeRouter = async () => {
    const settings = await apiManager.getSettings();
    router = new Router(header, nav, content, settings.root);
    router.addRoute({
        url: '',
        name: 'Home',
        generator: async () => await populateTemplate(root.toString(), {})
    } as Route);
    await addRoutesForEnabledModules(settings.modules);
    await router.generatePage();
    document.getElementById('body')!.className = "";
};

const addRoutesForEnabledModules = async (modules: Modules) => {
    const enabledModules = Object.keys(modules)
        .filter((moduleName: string) => modules[moduleName].enabled)
        .map((moduleName: string) => {
            modules[moduleName].name = moduleName;
            return modules[moduleName];
        });

    enabledModules.forEach((module: Module) => {
        const generateHTMLForReviews = async (): Promise<HTMLElement[]> => {
            const data: IReview[] = await apiManager.getReviewData(module.json);
            let reviews: IReview[];

            if (module.name === 'Books') {
                reviews = data.map(object => new Book(object as IBook));
            }
            else if (module.name === 'Places') {
                reviews = data.map(object => new Place(object as IPlace));
            }
            else {
                reviews = [];
            }

            const htmlElements = await Promise.all(reviews.map(review => {
                return review.render();
            }));

            return ([] as HTMLElement[]).concat(...htmlElements);
        };

        router!.addRoute({
            url: module.route,
            name: module.name,
            generator: generateHTMLForReviews,
        } as Route);
    })
};

let router: Router | null = null;
initializeRouter();

