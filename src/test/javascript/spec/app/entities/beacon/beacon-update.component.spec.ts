/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SmartTrackingBeaconsTestModule } from '../../../test.module';
import { BeaconUpdateComponent } from 'app/entities/beacon/beacon-update.component';
import { BeaconService } from 'app/entities/beacon/beacon.service';
import { Beacon } from 'app/shared/model/beacon.model';

describe('Component Tests', () => {
    describe('Beacon Management Update Component', () => {
        let comp: BeaconUpdateComponent;
        let fixture: ComponentFixture<BeaconUpdateComponent>;
        let service: BeaconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SmartTrackingBeaconsTestModule],
                declarations: [BeaconUpdateComponent]
            })
                .overrideTemplate(BeaconUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BeaconUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BeaconService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Beacon(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.beacon = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Beacon();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.beacon = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
