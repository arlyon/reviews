import {IReview} from "./review";
import * as bookTemplate from '../../templates/book.html';
import {populateTemplate} from "../templatelib";

export interface IBook extends IReview {
    author: string;
}

export class Book implements IBook {

    name: string;
    rating: string;
    review: string;
    date: string;
    website: string;
    pros: string[];
    cons: string[];

    author: string;

    constructor(book: IBook) {
        this.name = book.name;
        this.rating = book.rating;
        this.review = book.review;
        this.date = book.date;
        this.website = book.website;
        this.pros = book.pros;
        this.cons = book.cons;

        this.author = book.author;
    }

    public render = async (): Promise<HTMLElement[]> => {
        return await populateTemplate(bookTemplate.toString(), this) as HTMLElement[];
    };
}