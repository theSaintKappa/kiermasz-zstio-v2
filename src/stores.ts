import { writable } from 'svelte/store';

export const user = writable<User>(null);

export const textbookTitles = writable<string[]>([]);

export const lastBackup = writable<BackupDocument>(null);
