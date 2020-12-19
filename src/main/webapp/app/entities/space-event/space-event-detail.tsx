import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './space-event.reducer';
import { ISpaceEvent } from 'app/shared/model/space-event.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISpaceEventDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SpaceEventDetail = (props: ISpaceEventDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { spaceEventEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="spaceApp.spaceEvent.detail.title">SpaceEvent</Translate> [<b>{spaceEventEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="spaceApp.spaceEvent.name">Name</Translate>
            </span>
          </dt>
          <dd>{spaceEventEntity.name}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="spaceApp.spaceEvent.date">Date</Translate>
            </span>
          </dt>
          <dd>{spaceEventEntity.date ? <TextFormat value={spaceEventEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="spaceApp.spaceEvent.description">Description</Translate>
            </span>
          </dt>
          <dd>{spaceEventEntity.description}</dd>
          <dt>
            <span id="photo">
              <Translate contentKey="spaceApp.spaceEvent.photo">Photo</Translate>
            </span>
          </dt>
          <dd>
            {spaceEventEntity.photo ? (
              <div>
                {spaceEventEntity.photoContentType ? (
                  <a onClick={openFile(spaceEventEntity.photoContentType, spaceEventEntity.photo)}>
                    <img src={`data:${spaceEventEntity.photoContentType};base64,${spaceEventEntity.photo}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {spaceEventEntity.photoContentType}, {byteSize(spaceEventEntity.photo)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="type">
              <Translate contentKey="spaceApp.spaceEvent.type">Type</Translate>
            </span>
          </dt>
          <dd>{spaceEventEntity.type}</dd>
          <dt>
            <Translate contentKey="spaceApp.spaceEvent.mission">Mission</Translate>
          </dt>
          <dd>{spaceEventEntity.mission ? spaceEventEntity.mission.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/space-event" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/space-event/${spaceEventEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ spaceEvent }: IRootState) => ({
  spaceEventEntity: spaceEvent.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SpaceEventDetail);
