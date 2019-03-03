package org.fmi.smarttrackingbeacons.web.rest;

import org.fmi.smarttrackingbeacons.SmartTrackingBeaconsApp;

import org.fmi.smarttrackingbeacons.domain.Beacon;
import org.fmi.smarttrackingbeacons.repository.BeaconRepository;
import org.fmi.smarttrackingbeacons.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static org.fmi.smarttrackingbeacons.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BeaconResource REST controller.
 *
 * @see BeaconResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SmartTrackingBeaconsApp.class)
public class BeaconResourceIntTest {

    private static final String DEFAULT_UUID = "AAAAAAAAAA";
    private static final String UPDATED_UUID = "BBBBBBBBBB";

    @Autowired
    private BeaconRepository beaconRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restBeaconMockMvc;

    private Beacon beacon;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BeaconResource beaconResource = new BeaconResource(beaconRepository);
        this.restBeaconMockMvc = MockMvcBuilders.standaloneSetup(beaconResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Beacon createEntity(EntityManager em) {
        Beacon beacon = new Beacon()
            .uuid(DEFAULT_UUID);
        return beacon;
    }

    @Before
    public void initTest() {
        beacon = createEntity(em);
    }

    @Test
    @Transactional
    public void createBeacon() throws Exception {
        int databaseSizeBeforeCreate = beaconRepository.findAll().size();

        // Create the Beacon
        restBeaconMockMvc.perform(post("/api/beacons")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(beacon)))
            .andExpect(status().isCreated());

        // Validate the Beacon in the database
        List<Beacon> beaconList = beaconRepository.findAll();
        assertThat(beaconList).hasSize(databaseSizeBeforeCreate + 1);
        Beacon testBeacon = beaconList.get(beaconList.size() - 1);
        assertThat(testBeacon.getUuid()).isEqualTo(DEFAULT_UUID);
    }

    @Test
    @Transactional
    public void createBeaconWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = beaconRepository.findAll().size();

        // Create the Beacon with an existing ID
        beacon.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBeaconMockMvc.perform(post("/api/beacons")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(beacon)))
            .andExpect(status().isBadRequest());

        // Validate the Beacon in the database
        List<Beacon> beaconList = beaconRepository.findAll();
        assertThat(beaconList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllBeacons() throws Exception {
        // Initialize the database
        beaconRepository.saveAndFlush(beacon);

        // Get all the beaconList
        restBeaconMockMvc.perform(get("/api/beacons?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(beacon.getId().intValue())))
            .andExpect(jsonPath("$.[*].uuid").value(hasItem(DEFAULT_UUID.toString())));
    }
    
    @Test
    @Transactional
    public void getBeacon() throws Exception {
        // Initialize the database
        beaconRepository.saveAndFlush(beacon);

        // Get the beacon
        restBeaconMockMvc.perform(get("/api/beacons/{id}", beacon.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(beacon.getId().intValue()))
            .andExpect(jsonPath("$.uuid").value(DEFAULT_UUID.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBeacon() throws Exception {
        // Get the beacon
        restBeaconMockMvc.perform(get("/api/beacons/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBeacon() throws Exception {
        // Initialize the database
        beaconRepository.saveAndFlush(beacon);

        int databaseSizeBeforeUpdate = beaconRepository.findAll().size();

        // Update the beacon
        Beacon updatedBeacon = beaconRepository.findById(beacon.getId()).get();
        // Disconnect from session so that the updates on updatedBeacon are not directly saved in db
        em.detach(updatedBeacon);
        updatedBeacon
            .uuid(UPDATED_UUID);

        restBeaconMockMvc.perform(put("/api/beacons")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBeacon)))
            .andExpect(status().isOk());

        // Validate the Beacon in the database
        List<Beacon> beaconList = beaconRepository.findAll();
        assertThat(beaconList).hasSize(databaseSizeBeforeUpdate);
        Beacon testBeacon = beaconList.get(beaconList.size() - 1);
        assertThat(testBeacon.getUuid()).isEqualTo(UPDATED_UUID);
    }

    @Test
    @Transactional
    public void updateNonExistingBeacon() throws Exception {
        int databaseSizeBeforeUpdate = beaconRepository.findAll().size();

        // Create the Beacon

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBeaconMockMvc.perform(put("/api/beacons")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(beacon)))
            .andExpect(status().isBadRequest());

        // Validate the Beacon in the database
        List<Beacon> beaconList = beaconRepository.findAll();
        assertThat(beaconList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBeacon() throws Exception {
        // Initialize the database
        beaconRepository.saveAndFlush(beacon);

        int databaseSizeBeforeDelete = beaconRepository.findAll().size();

        // Delete the beacon
        restBeaconMockMvc.perform(delete("/api/beacons/{id}", beacon.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Beacon> beaconList = beaconRepository.findAll();
        assertThat(beaconList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Beacon.class);
        Beacon beacon1 = new Beacon();
        beacon1.setId(1L);
        Beacon beacon2 = new Beacon();
        beacon2.setId(beacon1.getId());
        assertThat(beacon1).isEqualTo(beacon2);
        beacon2.setId(2L);
        assertThat(beacon1).isNotEqualTo(beacon2);
        beacon1.setId(null);
        assertThat(beacon1).isNotEqualTo(beacon2);
    }
}
