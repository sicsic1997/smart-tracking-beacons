/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { SmartTrackingBeaconsTestModule } from '../../../test.module';
import { BeaconDeleteDialogComponent } from 'app/entities/beacon/beacon-delete-dialog.component';
import { BeaconService } from 'app/entities/beacon/beacon.service';

describe('Component Tests', () => {
    describe('Beacon Management Delete Component', () => {
        let comp: BeaconDeleteDialogComponent;
        let fixture: ComponentFixture<BeaconDeleteDialogComponent>;
        let service: BeaconService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmartTrackingBeaconsTestModule],
                declarations: [BeaconDeleteDialogComponent]
            })
                .overrideTemplate(BeaconDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BeaconDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BeaconService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
