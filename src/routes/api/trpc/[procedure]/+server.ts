import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";
import type { RequestHandler } from "@sveltejs/kit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const fallback = (async (event) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: event.request,
		router,
		createContext: () => createContext(event)
	});
}) satisfies RequestHandler;
