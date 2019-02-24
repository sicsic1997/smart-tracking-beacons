import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import {
    SmartTrackingBeaconsSharedLibsModule,
    SmartTrackingBeaconsSharedCommonModule,
    JhiLoginModalComponent,
    HasAnyAuthorityDirective
} from './';

@NgModule({
    imports: [SmartTrackingBeaconsSharedLibsModule, SmartTrackingBeaconsSharedCommonModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [JhiLoginModalComponent],
    exports: [SmartTrackingBeaconsSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmartTrackingBeaconsSharedModule {
    static forRoot() {
        return {
            ngModule: SmartTrackingBeaconsSharedModule
        };
    }
}
