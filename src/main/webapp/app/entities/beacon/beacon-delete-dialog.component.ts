import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBeacon } from 'app/shared/model/beacon.model';
import { BeaconService } from './beacon.service';

@Component({
    selector: 'jhi-beacon-delete-dialog',
    templateUrl: './beacon-delete-dialog.component.html'
})
export class BeaconDeleteDialogComponent {
    beacon: IBeacon;

    constructor(protected beaconService: BeaconService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.beaconService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'beaconListModification',
                content: 'Deleted an beacon'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-beacon-delete-popup',
    template: ''
})
export class BeaconDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ beacon }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BeaconDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.beacon = beacon;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/beacon', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/beacon', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
