import { createCaller } from "./router";
import { createContext } from "./context";

import type { ServerLoadEvent } from "@sveltejs/kit";

export async function trpc(event: ServerLoadEvent) {
	return createCaller(await createContext(event));
}
