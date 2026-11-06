import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JsonFileRepository } from '../common/json-file.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly repository = new JsonFileRepository<Task>('tasks.json');

  async onModuleInit(): Promise<void> {
    await this.repository.initialize();
  }

  findAll(): Task[] {
    return this.repository.findAll();
  }

  findOne(id: string): Task {
    const task = this.repository.findById(id);
    if (!task) throw new NotFoundException(`Tarefa ${id} não encontrada.`);
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      completed: dto.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    return this.repository.insert(task);
  }

  async replace(id: string, dto: CreateTaskDto): Promise<Task> {
    const current = this.findOne(id);
    const now = new Date().toISOString();
    const updated: Task = {
      ...current,
      title: dto.title,
      description: dto.description,
      completed: dto.completed ?? false,
      updatedAt: now,
    };
    return (await this.repository.replace(id, updated))!;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const current = this.findOne(id);
    const updated = {
      ...current,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return (await this.repository.replace(id, updated))!;
  }

  async remove(id: string): Promise<void> {
    this.findOne(id);
    await this.repository.remove(id);
  }
}
