import { writable } from 'svelte/store';
import type { User } from "./api";

export const user = writable<User>();
