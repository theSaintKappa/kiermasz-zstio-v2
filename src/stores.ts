import { writable } from 'svelte/store';

export const user = writable<User>(null);

export const searchQuery = writable<string>('');

export const textbookTitles = writable<string[]>([]);

export const lastBackup = writable<BackupDocument>(null);

export const writingDisabled = writable<boolean>(false);
