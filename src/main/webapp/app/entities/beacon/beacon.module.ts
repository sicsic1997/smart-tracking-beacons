import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SmartTrackingBeaconsSharedModule } from 'app/shared';
import {
    BeaconComponent,
    BeaconDetailComponent,
    BeaconUpdateComponent,
    BeaconDeletePopupComponent,
    BeaconDeleteDialogComponent,
    beaconRoute,
    beaconPopupRoute
} from './';

const ENTITY_STATES = [...beaconRoute, ...beaconPopupRoute];

@NgModule({
    imports: [SmartTrackingBeaconsSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BeaconComponent, BeaconDetailComponent, BeaconUpdateComponent, BeaconDeleteDialogComponent, BeaconDeletePopupComponent],
    entryComponents: [BeaconComponent, BeaconUpdateComponent, BeaconDeleteDialogComponent, BeaconDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmartTrackingBeaconsBeaconModule {}
