import {IReview} from "./review";
import * as placeTemplate from '../../templates/place.html';
import {populateTemplate} from "../templatelib";

export interface IPlace extends IReview {
    address: string;
    price: string;
    food: string[];
    googlemaps: string;
}

export class Place implements IPlace {

    name: string;
    rating: string;
    review: string;
    date: string;
    website: string;
    pros: string[];
    cons: string[];

    address: string;
    price: string;
    food: string[];
    googlemaps: string;

    constructor(place: IPlace) {
        this.name = place.name;
        this.rating = place.rating;
        this.review = place.review;
        this.date = place.date;
        this.website = place.website;
        this.pros = place.pros;
        this.cons = place.cons;

        this.address = place.address;
        this.price = place.price;
        this.food = place.food;
        this.googlemaps = place.googlemaps;
    }

    public render = async (): Promise<HTMLElement[]> => {
        return await populateTemplate(placeTemplate.toString(), this) as HTMLElement[];
    }
}