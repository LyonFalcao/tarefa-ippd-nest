import { StoredEntity } from '../common/json-file.repository';

export interface Task extends StoredEntity {
  title: string;
  description?: string;
  completed: boolean;
}
