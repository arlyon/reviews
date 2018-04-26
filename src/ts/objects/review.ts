export interface IReview {
    name: string;
    rating: string;
    review: string;
    date: string;
    website: string;
    pros: string[];
    cons: string[];

    render(): Promise<HTMLElement[]>;
}