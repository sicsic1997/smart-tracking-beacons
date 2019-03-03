import { ILocation } from 'app/shared/model/location.model';

export interface IBeacon {
    id?: number;
    uuid?: string;
    location?: ILocation;
}

export class Beacon implements IBeacon {
    constructor(public id?: number, public uuid?: string, public location?: ILocation) {}
}
