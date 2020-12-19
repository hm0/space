import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Mission from './mission';
import MissionDetail from './mission-detail';
import MissionUpdate from './mission-update';
import MissionDeleteDialog from './mission-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={MissionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={MissionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={MissionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Mission} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={MissionDeleteDialog} />
  </>
);

export default Routes;
