import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './mission.reducer';
import { IMission } from 'app/shared/model/mission.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IMissionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MissionDetail = (props: IMissionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { missionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="spaceApp.mission.detail.title">Mission</Translate> [<b>{missionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="spaceApp.mission.name">Name</Translate>
            </span>
          </dt>
          <dd>{missionEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="spaceApp.mission.description">Description</Translate>
            </span>
          </dt>
          <dd>{missionEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/mission" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/mission/${missionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ mission }: IRootState) => ({
  missionEntity: mission.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MissionDetail);
