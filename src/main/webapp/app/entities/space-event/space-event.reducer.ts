import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISpaceEvent, defaultValue } from 'app/shared/model/space-event.model';

export const ACTION_TYPES = {
  FETCH_SPACEEVENT_LIST: 'spaceEvent/FETCH_SPACEEVENT_LIST',
  FETCH_SPACEEVENT: 'spaceEvent/FETCH_SPACEEVENT',
  CREATE_SPACEEVENT: 'spaceEvent/CREATE_SPACEEVENT',
  UPDATE_SPACEEVENT: 'spaceEvent/UPDATE_SPACEEVENT',
  DELETE_SPACEEVENT: 'spaceEvent/DELETE_SPACEEVENT',
  SET_BLOB: 'spaceEvent/SET_BLOB',
  RESET: 'spaceEvent/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISpaceEvent>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type SpaceEventState = Readonly<typeof initialState>;

// Reducer

export default (state: SpaceEventState = initialState, action): SpaceEventState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SPACEEVENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SPACEEVENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_SPACEEVENT):
    case REQUEST(ACTION_TYPES.UPDATE_SPACEEVENT):
    case REQUEST(ACTION_TYPES.DELETE_SPACEEVENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_SPACEEVENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SPACEEVENT):
    case FAILURE(ACTION_TYPES.CREATE_SPACEEVENT):
    case FAILURE(ACTION_TYPES.UPDATE_SPACEEVENT):
    case FAILURE(ACTION_TYPES.DELETE_SPACEEVENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SPACEEVENT_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_SPACEEVENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_SPACEEVENT):
    case SUCCESS(ACTION_TYPES.UPDATE_SPACEEVENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_SPACEEVENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/space-events';

// Actions

export const getEntities: ICrudGetAllAction<ISpaceEvent> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SPACEEVENT_LIST,
    payload: axios.get<ISpaceEvent>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ISpaceEvent> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SPACEEVENT,
    payload: axios.get<ISpaceEvent>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ISpaceEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SPACEEVENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<ISpaceEvent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SPACEEVENT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISpaceEvent> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SPACEEVENT,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
