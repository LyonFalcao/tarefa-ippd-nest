import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JsonFileRepository } from '../common/json-file.repository';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService implements OnModuleInit {
  private readonly repository = new JsonFileRepository<Book>('books.json');

  async onModuleInit(): Promise<void> {
    await this.repository.initialize();
  }

  findAll(): Book[] {
    return this.repository.findAll();
  }

  findOne(id: string): Book {
    const book = this.repository.findById(id);
    if (!book) throw new NotFoundException(`Livro ${id} não encontrado.`);
    return book;
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const now = new Date().toISOString();
    const book: Book = {
      id: randomUUID(),
      title: dto.title,
      author: dto.author,
      publishedYear: dto.publishedYear,
      read: dto.read ?? false,
      createdAt: now,
      updatedAt: now,
    };
    return this.repository.insert(book);
  }

  async replace(id: string, dto: CreateBookDto): Promise<Book> {
    const current = this.findOne(id);
    const updated: Book = {
      ...current,
      title: dto.title,
      author: dto.author,
      publishedYear: dto.publishedYear,
      read: dto.read ?? false,
      updatedAt: new Date().toISOString(),
    };
    return (await this.repository.replace(id, updated))!;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
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
