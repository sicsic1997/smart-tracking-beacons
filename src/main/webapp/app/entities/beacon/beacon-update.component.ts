import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBeacon } from 'app/shared/model/beacon.model';
import { BeaconService } from './beacon.service';
import { ILocation } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location';

@Component({
    selector: 'jhi-beacon-update',
    templateUrl: './beacon-update.component.html'
})
export class BeaconUpdateComponent implements OnInit {
    beacon: IBeacon;
    isSaving: boolean;

    locations: ILocation[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected beaconService: BeaconService,
        protected locationService: LocationService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ beacon }) => {
            this.beacon = beacon;
        });
        this.locationService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ILocation[]>) => mayBeOk.ok),
                map((response: HttpResponse<ILocation[]>) => response.body)
            )
            .subscribe((res: ILocation[]) => (this.locations = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.beacon.id !== undefined) {
            this.subscribeToSaveResponse(this.beaconService.update(this.beacon));
        } else {
            this.subscribeToSaveResponse(this.beaconService.create(this.beacon));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBeacon>>) {
        result.subscribe((res: HttpResponse<IBeacon>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackLocationById(index: number, item: ILocation) {
        return item.id;
    }
}
