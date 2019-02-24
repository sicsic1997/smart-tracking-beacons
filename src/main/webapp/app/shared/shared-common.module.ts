import { NgModule } from '@angular/core';

import { SmartTrackingBeaconsSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [SmartTrackingBeaconsSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [SmartTrackingBeaconsSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class SmartTrackingBeaconsSharedCommonModule {}
