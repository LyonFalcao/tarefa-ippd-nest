import { StoredEntity } from '../common/json-file.repository';

export interface Book extends StoredEntity {
  title: string;
  author: string;
  publishedYear?: number;
  read: boolean;
}
