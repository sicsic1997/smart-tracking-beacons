export interface ILocation {
    id?: number;
    code?: string;
    description?: string;
}

export class Location implements ILocation {
    constructor(public id?: number, public code?: string, public description?: string) {}
}
