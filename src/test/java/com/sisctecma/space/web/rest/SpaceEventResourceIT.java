package com.sisctecma.space.web.rest;

import com.sisctecma.space.SpaceApp;
import com.sisctecma.space.domain.SpaceEvent;
import com.sisctecma.space.repository.SpaceEventRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sisctecma.space.domain.enumeration.SpaceEventType;
/**
 * Integration tests for the {@link SpaceEventResource} REST controller.
 */
@SpringBootTest(classes = SpaceApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class SpaceEventResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final SpaceEventType DEFAULT_TYPE = SpaceEventType.LAUNCH;
    private static final SpaceEventType UPDATED_TYPE = SpaceEventType.LANDING;

    @Autowired
    private SpaceEventRepository spaceEventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSpaceEventMockMvc;

    private SpaceEvent spaceEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SpaceEvent createEntity(EntityManager em) {
        SpaceEvent spaceEvent = new SpaceEvent()
            .name(DEFAULT_NAME)
            .date(DEFAULT_DATE)
            .description(DEFAULT_DESCRIPTION)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE)
            .type(DEFAULT_TYPE);
        return spaceEvent;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SpaceEvent createUpdatedEntity(EntityManager em) {
        SpaceEvent spaceEvent = new SpaceEvent()
            .name(UPDATED_NAME)
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .type(UPDATED_TYPE);
        return spaceEvent;
    }

    @BeforeEach
    public void initTest() {
        spaceEvent = createEntity(em);
    }

    @Test
    @Transactional
    public void createSpaceEvent() throws Exception {
        int databaseSizeBeforeCreate = spaceEventRepository.findAll().size();
        // Create the SpaceEvent
        restSpaceEventMockMvc.perform(post("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(spaceEvent)))
            .andExpect(status().isCreated());

        // Validate the SpaceEvent in the database
        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeCreate + 1);
        SpaceEvent testSpaceEvent = spaceEventList.get(spaceEventList.size() - 1);
        assertThat(testSpaceEvent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSpaceEvent.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testSpaceEvent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSpaceEvent.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testSpaceEvent.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testSpaceEvent.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    public void createSpaceEventWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = spaceEventRepository.findAll().size();

        // Create the SpaceEvent with an existing ID
        spaceEvent.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSpaceEventMockMvc.perform(post("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(spaceEvent)))
            .andExpect(status().isBadRequest());

        // Validate the SpaceEvent in the database
        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = spaceEventRepository.findAll().size();
        // set the field null
        spaceEvent.setName(null);

        // Create the SpaceEvent, which fails.


        restSpaceEventMockMvc.perform(post("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(spaceEvent)))
            .andExpect(status().isBadRequest());

        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = spaceEventRepository.findAll().size();
        // set the field null
        spaceEvent.setDate(null);

        // Create the SpaceEvent, which fails.


        restSpaceEventMockMvc.perform(post("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(spaceEvent)))
            .andExpect(status().isBadRequest());

        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = spaceEventRepository.findAll().size();
        // set the field null
        spaceEvent.setType(null);

        // Create the SpaceEvent, which fails.


        restSpaceEventMockMvc.perform(post("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(spaceEvent)))
            .andExpect(status().isBadRequest());

        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSpaceEvents() throws Exception {
        // Initialize the database
        spaceEventRepository.saveAndFlush(spaceEvent);

        // Get all the spaceEventList
        restSpaceEventMockMvc.perform(get("/api/space-events?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(spaceEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }
    
    @Test
    @Transactional
    public void getSpaceEvent() throws Exception {
        // Initialize the database
        spaceEventRepository.saveAndFlush(spaceEvent);

        // Get the spaceEvent
        restSpaceEventMockMvc.perform(get("/api/space-events/{id}", spaceEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(spaceEvent.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingSpaceEvent() throws Exception {
        // Get the spaceEvent
        restSpaceEventMockMvc.perform(get("/api/space-events/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSpaceEvent() throws Exception {
        // Initialize the database
        spaceEventRepository.saveAndFlush(spaceEvent);

        int databaseSizeBeforeUpdate = spaceEventRepository.findAll().size();

        // Update the spaceEvent
        SpaceEvent updatedSpaceEvent = spaceEventRepository.findById(spaceEvent.getId()).get();
        // Disconnect from session so that the updates on updatedSpaceEvent are not directly saved in db
        em.detach(updatedSpaceEvent);
        updatedSpaceEvent
            .name(UPDATED_NAME)
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .type(UPDATED_TYPE);

        restSpaceEventMockMvc.perform(put("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSpaceEvent)))
            .andExpect(status().isOk());

        // Validate the SpaceEvent in the database
        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeUpdate);
        SpaceEvent testSpaceEvent = spaceEventList.get(spaceEventList.size() - 1);
        assertThat(testSpaceEvent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSpaceEvent.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testSpaceEvent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSpaceEvent.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testSpaceEvent.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testSpaceEvent.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingSpaceEvent() throws Exception {
        int databaseSizeBeforeUpdate = spaceEventRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpaceEventMockMvc.perform(put("/api/space-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(spaceEvent)))
            .andExpect(status().isBadRequest());

        // Validate the SpaceEvent in the database
        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSpaceEvent() throws Exception {
        // Initialize the database
        spaceEventRepository.saveAndFlush(spaceEvent);

        int databaseSizeBeforeDelete = spaceEventRepository.findAll().size();

        // Delete the spaceEvent
        restSpaceEventMockMvc.perform(delete("/api/space-events/{id}", spaceEvent.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SpaceEvent> spaceEventList = spaceEventRepository.findAll();
        assertThat(spaceEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
