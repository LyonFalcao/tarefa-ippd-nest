import { Injectable } from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export interface StoredEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class JsonFileRepository<T extends StoredEntity> {
  private readonly filePath: string;
  private records: T[] = [];
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(fileName: string) {
    this.filePath = join(process.cwd(), 'data', fileName);
  }

  async initialize(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      const content = await readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(content);
      this.records = Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;
      this.records = [];
      await this.persist();
    }
  }

  findAll(): T[] {
    return [...this.records];
  }

  findById(id: string): T | undefined {
    return this.records.find((record) => record.id === id);
  }

  async insert(record: T): Promise<T> {
    this.records.push(record);
    await this.persist();
    return record;
  }

  async replace(id: string, record: T): Promise<T | undefined> {
    const index = this.records.findIndex((item) => item.id === id);
    if (index < 0) return undefined;
    this.records[index] = record;
    await this.persist();
    return record;
  }

  async remove(id: string): Promise<boolean> {
    const index = this.records.findIndex((item) => item.id === id);
    if (index < 0) return false;
    this.records.splice(index, 1);
    await this.persist();
    return true;
  }

  private async persist(): Promise<void> {
    const snapshot = JSON.stringify(this.records, null, 2);
    this.writeQueue = this.writeQueue.then(async () => {
      const temporaryPath = `${this.filePath}.tmp`;
      await writeFile(temporaryPath, snapshot, 'utf8');
      await rename(temporaryPath, this.filePath);
    });
    await this.writeQueue;
  }
}
