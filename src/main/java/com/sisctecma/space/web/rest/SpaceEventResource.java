package com.sisctecma.space.web.rest;

import com.sisctecma.space.domain.SpaceEvent;
import com.sisctecma.space.repository.SpaceEventRepository;
import com.sisctecma.space.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.sisctecma.space.domain.SpaceEvent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SpaceEventResource {

    private final Logger log = LoggerFactory.getLogger(SpaceEventResource.class);

    private static final String ENTITY_NAME = "spaceEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SpaceEventRepository spaceEventRepository;

    public SpaceEventResource(SpaceEventRepository spaceEventRepository) {
        this.spaceEventRepository = spaceEventRepository;
    }

    /**
     * {@code POST  /space-events} : Create a new spaceEvent.
     *
     * @param spaceEvent the spaceEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new spaceEvent, or with status {@code 400 (Bad Request)} if the spaceEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/space-events")
    public ResponseEntity<SpaceEvent> createSpaceEvent(@Valid @RequestBody SpaceEvent spaceEvent) throws URISyntaxException {
        log.debug("REST request to save SpaceEvent : {}", spaceEvent);
        if (spaceEvent.getId() != null) {
            throw new BadRequestAlertException("A new spaceEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SpaceEvent result = spaceEventRepository.save(spaceEvent);
        return ResponseEntity.created(new URI("/api/space-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /space-events} : Updates an existing spaceEvent.
     *
     * @param spaceEvent the spaceEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated spaceEvent,
     * or with status {@code 400 (Bad Request)} if the spaceEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the spaceEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/space-events")
    public ResponseEntity<SpaceEvent> updateSpaceEvent(@Valid @RequestBody SpaceEvent spaceEvent) throws URISyntaxException {
        log.debug("REST request to update SpaceEvent : {}", spaceEvent);
        if (spaceEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SpaceEvent result = spaceEventRepository.save(spaceEvent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, spaceEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /space-events} : get all the spaceEvents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of spaceEvents in body.
     */
    @GetMapping("/space-events")
    public ResponseEntity<List<SpaceEvent>> getAllSpaceEvents(Pageable pageable) {
        log.debug("REST request to get a page of SpaceEvents");
        Page<SpaceEvent> page = spaceEventRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /space-events/:id} : get the "id" spaceEvent.
     *
     * @param id the id of the spaceEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the spaceEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/space-events/{id}")
    public ResponseEntity<SpaceEvent> getSpaceEvent(@PathVariable Long id) {
        log.debug("REST request to get SpaceEvent : {}", id);
        Optional<SpaceEvent> spaceEvent = spaceEventRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(spaceEvent);
    }

    /**
     * {@code DELETE  /space-events/:id} : delete the "id" spaceEvent.
     *
     * @param id the id of the spaceEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/space-events/{id}")
    public ResponseEntity<Void> deleteSpaceEvent(@PathVariable Long id) {
        log.debug("REST request to delete SpaceEvent : {}", id);
        spaceEventRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
