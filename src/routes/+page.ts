import type { PageLoadEvent } from "./$types";

export async function load({ data }: PageLoadEvent) {
	return { ...data };
}
