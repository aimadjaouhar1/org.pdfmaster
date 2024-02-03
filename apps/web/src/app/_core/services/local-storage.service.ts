import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public set<T>(key: string, value: T) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        return;
    }
  }

  public get<T>(key: string): T | undefined {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) as T : undefined;
    } catch (error) {
        return undefined;
    }
  }
  public remove(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
