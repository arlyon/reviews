import {IReview} from "./objects/review";

export interface Settings {
    root: string;
    title: string;
    modules: Modules
}

export interface Modules {
    [name: string]: Module;
}

export interface Module {
    enabled: boolean;
    json: string;
    name?: string;
    route: string;
}

interface OpenLibraryBook {
    publish_date: string;
    isbn_10: string[];
    title: string;
    isbn_13: string[];
    publishers: string[];
}

interface ApiMethods {
    getSettings(): Promise<Settings>;

    getReviewData(endpoint: string): Promise<IReview[]>;
}

/**
 * The api manager for the application.
 */
class ApiManager implements ApiMethods {

    /**
     * Gets the settings from the server.
     * @returns {Promise<Settings>}
     */
    public async getSettings(): Promise<Settings> {
        const response = await fetch('./settings.json');
        if (response.status != 200) {
            throw new Error("Could not load settings.");
        } else {
            return await response.json()
        }
    };

    /**
     * Gets a list of reviews from the given endpoint.
     * @param {string} endpoint
     * @returns {Promise<IReview[]>}
     */
    public async getReviewData(endpoint: string): Promise<IReview[]> {
        const response = await fetch(endpoint);
        return response.status == 200 ? await response.json() as IReview[] : [];
    }

    /**
     * Fetches a book corresponding to a given ISBN from openlibrary.
     * @param {string} isbn The isbn to query.
     * @returns {Promise<OpenLibraryBook>} The book.
     */
    public async getBookData(isbn: string): Promise<OpenLibraryBook | null> {
        const bookResponse = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
        return bookResponse.status == 200 ? await bookResponse.json() as OpenLibraryBook : null;
    };
}

export let apiManager = new ApiManager();
