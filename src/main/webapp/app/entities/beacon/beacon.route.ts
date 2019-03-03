import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Beacon } from 'app/shared/model/beacon.model';
import { BeaconService } from './beacon.service';
import { BeaconComponent } from './beacon.component';
import { BeaconDetailComponent } from './beacon-detail.component';
import { BeaconUpdateComponent } from './beacon-update.component';
import { BeaconDeletePopupComponent } from './beacon-delete-dialog.component';
import { IBeacon } from 'app/shared/model/beacon.model';

@Injectable({ providedIn: 'root' })
export class BeaconResolve implements Resolve<IBeacon> {
    constructor(private service: BeaconService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBeacon> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Beacon>) => response.ok),
                map((beacon: HttpResponse<Beacon>) => beacon.body)
            );
        }
        return of(new Beacon());
    }
}

export const beaconRoute: Routes = [
    {
        path: '',
        component: BeaconComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Beacons'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: BeaconDetailComponent,
        resolve: {
            beacon: BeaconResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Beacons'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: BeaconUpdateComponent,
        resolve: {
            beacon: BeaconResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Beacons'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: BeaconUpdateComponent,
        resolve: {
            beacon: BeaconResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Beacons'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const beaconPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: BeaconDeletePopupComponent,
        resolve: {
            beacon: BeaconResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Beacons'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
