import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IMission } from 'app/shared/model/mission.model';
import { getEntities as getMissions } from 'app/entities/mission/mission.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './space-event.reducer';
import { ISpaceEvent } from 'app/shared/model/space-event.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ISpaceEventUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SpaceEventUpdate = (props: ISpaceEventUpdateProps) => {
  const [missionId, setMissionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { spaceEventEntity, missions, loading, updating } = props;

  const { description, photo, photoContentType } = spaceEventEntity;

  const handleClose = () => {
    props.history.push('/space-event');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getMissions();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...spaceEventEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="spaceApp.spaceEvent.home.createOrEditLabel">
            <Translate contentKey="spaceApp.spaceEvent.home.createOrEditLabel">Create or edit a SpaceEvent</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : spaceEventEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="space-event-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="space-event-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="space-event-name">
                  <Translate contentKey="spaceApp.spaceEvent.name">Name</Translate>
                </Label>
                <AvField
                  id="space-event-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="dateLabel" for="space-event-date">
                  <Translate contentKey="spaceApp.spaceEvent.date">Date</Translate>
                </Label>
                <AvField
                  id="space-event-date"
                  type="date"
                  className="form-control"
                  name="date"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="space-event-description">
                  <Translate contentKey="spaceApp.spaceEvent.description">Description</Translate>
                </Label>
                <AvInput
                  id="space-event-description"
                  type="textarea"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <AvGroup>
                  <Label id="photoLabel" for="photo">
                    <Translate contentKey="spaceApp.spaceEvent.photo">Photo</Translate>
                  </Label>
                  <br />
                  {photo ? (
                    <div>
                      {photoContentType ? (
                        <a onClick={openFile(photoContentType, photo)}>
                          <img src={`data:${photoContentType};base64,${photo}`} style={{ maxHeight: '100px' }} />
                        </a>
                      ) : null}
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {photoContentType}, {byteSize(photo)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('photo')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_photo" type="file" onChange={onBlobChange(true, 'photo')} accept="image/*" />
                  <AvInput
                    type="hidden"
                    name="photo"
                    value={photo}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                    }}
                  />
                </AvGroup>
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="space-event-type">
                  <Translate contentKey="spaceApp.spaceEvent.type">Type</Translate>
                </Label>
                <AvInput
                  id="space-event-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && spaceEventEntity.type) || 'LAUNCH'}
                >
                  <option value="LAUNCH">{translate('spaceApp.SpaceEventType.LAUNCH')}</option>
                  <option value="LANDING">{translate('spaceApp.SpaceEventType.LANDING')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="space-event-mission">
                  <Translate contentKey="spaceApp.spaceEvent.mission">Mission</Translate>
                </Label>
                <AvInput id="space-event-mission" type="select" className="form-control" name="mission.id">
                  <option value="" key="0" />
                  {missions
                    ? missions.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/space-event" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  missions: storeState.mission.entities,
  spaceEventEntity: storeState.spaceEvent.entity,
  loading: storeState.spaceEvent.loading,
  updating: storeState.spaceEvent.updating,
  updateSuccess: storeState.spaceEvent.updateSuccess,
});

const mapDispatchToProps = {
  getMissions,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SpaceEventUpdate);
