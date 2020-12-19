import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SpaceEvent from './space-event';
import SpaceEventDetail from './space-event-detail';
import SpaceEventUpdate from './space-event-update';
import SpaceEventDeleteDialog from './space-event-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SpaceEventUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SpaceEventUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SpaceEventDetail} />
      <ErrorBoundaryRoute path={match.url} component={SpaceEvent} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={SpaceEventDeleteDialog} />
  </>
);

export default Routes;
