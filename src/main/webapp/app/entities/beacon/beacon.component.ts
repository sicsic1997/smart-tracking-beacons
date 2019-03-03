import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBeacon } from 'app/shared/model/beacon.model';
import { AccountService } from 'app/core';
import { BeaconService } from './beacon.service';

@Component({
    selector: 'jhi-beacon',
    templateUrl: './beacon.component.html'
})
export class BeaconComponent implements OnInit, OnDestroy {
    beacons: IBeacon[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected beaconService: BeaconService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.beaconService
            .query()
            .pipe(
                filter((res: HttpResponse<IBeacon[]>) => res.ok),
                map((res: HttpResponse<IBeacon[]>) => res.body)
            )
            .subscribe(
                (res: IBeacon[]) => {
                    this.beacons = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBeacons();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBeacon) {
        return item.id;
    }

    registerChangeInBeacons() {
        this.eventSubscriber = this.eventManager.subscribe('beaconListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
