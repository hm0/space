import { Moment } from 'moment';
import { IMission } from 'app/shared/model/mission.model';
import { SpaceEventType } from 'app/shared/model/enumerations/space-event-type.model';

export interface ISpaceEvent {
  id?: number;
  name?: string;
  date?: string;
  description?: any;
  photoContentType?: string;
  photo?: any;
  type?: SpaceEventType;
  mission?: IMission;
}

export const defaultValue: Readonly<ISpaceEvent> = {};
