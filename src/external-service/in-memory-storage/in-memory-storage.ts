import {Injectable} from '@nestjs/common';

@Injectable()
export class InMemoryService<T> {
  private dataStore: Map<string, T> = new Map();

  create(key: string, value: T) {
    this.dataStore.set(key, value);
  }

  read(key: string) {
    return this.dataStore.get(key);
  }

  getAll() {
    return this.dataStore;
  }
}
