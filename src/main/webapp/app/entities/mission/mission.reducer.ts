import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IMission, defaultValue } from 'app/shared/model/mission.model';

export const ACTION_TYPES = {
  FETCH_MISSION_LIST: 'mission/FETCH_MISSION_LIST',
  FETCH_MISSION: 'mission/FETCH_MISSION',
  CREATE_MISSION: 'mission/CREATE_MISSION',
  UPDATE_MISSION: 'mission/UPDATE_MISSION',
  DELETE_MISSION: 'mission/DELETE_MISSION',
  RESET: 'mission/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IMission>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type MissionState = Readonly<typeof initialState>;

// Reducer

export default (state: MissionState = initialState, action): MissionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_MISSION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MISSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_MISSION):
    case REQUEST(ACTION_TYPES.UPDATE_MISSION):
    case REQUEST(ACTION_TYPES.DELETE_MISSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_MISSION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MISSION):
    case FAILURE(ACTION_TYPES.CREATE_MISSION):
    case FAILURE(ACTION_TYPES.UPDATE_MISSION):
    case FAILURE(ACTION_TYPES.DELETE_MISSION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_MISSION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_MISSION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_MISSION):
    case SUCCESS(ACTION_TYPES.UPDATE_MISSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_MISSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/missions';

// Actions

export const getEntities: ICrudGetAllAction<IMission> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_MISSION_LIST,
    payload: axios.get<IMission>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IMission> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MISSION,
    payload: axios.get<IMission>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IMission> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MISSION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IMission> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MISSION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IMission> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MISSION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
