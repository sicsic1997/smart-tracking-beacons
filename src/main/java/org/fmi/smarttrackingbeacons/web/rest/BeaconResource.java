package org.fmi.smarttrackingbeacons.web.rest;
import org.fmi.smarttrackingbeacons.domain.Beacon;
import org.fmi.smarttrackingbeacons.repository.BeaconRepository;
import org.fmi.smarttrackingbeacons.web.rest.errors.BadRequestAlertException;
import org.fmi.smarttrackingbeacons.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Beacon.
 */
@RestController
@RequestMapping("/api")
public class BeaconResource {

    private final Logger log = LoggerFactory.getLogger(BeaconResource.class);

    private static final String ENTITY_NAME = "beacon";

    private final BeaconRepository beaconRepository;

    public BeaconResource(BeaconRepository beaconRepository) {
        this.beaconRepository = beaconRepository;
    }

    /**
     * POST  /beacons : Create a new beacon.
     *
     * @param beacon the beacon to create
     * @return the ResponseEntity with status 201 (Created) and with body the new beacon, or with status 400 (Bad Request) if the beacon has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/beacons")
    public ResponseEntity<Beacon> createBeacon(@RequestBody Beacon beacon) throws URISyntaxException {
        log.debug("REST request to save Beacon : {}", beacon);
        if (beacon.getId() != null) {
            throw new BadRequestAlertException("A new beacon cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Beacon result = beaconRepository.save(beacon);
        return ResponseEntity.created(new URI("/api/beacons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /beacons : Updates an existing beacon.
     *
     * @param beacon the beacon to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated beacon,
     * or with status 400 (Bad Request) if the beacon is not valid,
     * or with status 500 (Internal Server Error) if the beacon couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/beacons")
    public ResponseEntity<Beacon> updateBeacon(@RequestBody Beacon beacon) throws URISyntaxException {
        log.debug("REST request to update Beacon : {}", beacon);
        if (beacon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Beacon result = beaconRepository.save(beacon);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, beacon.getId().toString()))
            .body(result);
    }

    /**
     * GET  /beacons : get all the beacons.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of beacons in body
     */
    @GetMapping("/beacons")
    public List<Beacon> getAllBeacons() {
        log.debug("REST request to get all Beacons");
        return beaconRepository.findAll();
    }

    /**
     * GET  /beacons/:id : get the "id" beacon.
     *
     * @param id the id of the beacon to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the beacon, or with status 404 (Not Found)
     */
    @GetMapping("/beacons/{id}")
    public ResponseEntity<Beacon> getBeacon(@PathVariable Long id) {
        log.debug("REST request to get Beacon : {}", id);
        Optional<Beacon> beacon = beaconRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(beacon);
    }

    /**
     * DELETE  /beacons/:id : delete the "id" beacon.
     *
     * @param id the id of the beacon to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/beacons/{id}")
    public ResponseEntity<Void> deleteBeacon(@PathVariable Long id) {
        log.debug("REST request to delete Beacon : {}", id);
        beaconRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
