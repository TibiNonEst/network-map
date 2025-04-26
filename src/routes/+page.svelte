<script lang="ts">
	import "normalize.css/normalize.css";
	import "@fortawesome/fontawesome-free/css/fontawesome.css";
	import "@fortawesome/fontawesome-free/css/solid.css";
	import "mapbox-gl/dist/mapbox-gl.css";

	import { onMount } from "svelte";

	import { invalidateAll } from "$app/navigation";

	import Map from "$lib/Map.svelte";
	import PopDetails from "$lib/PopDetails.svelte";
	import Login from "$lib/Login.svelte";
	import Create from "$lib/Create.svelte";

	import { user } from "$lib/stores";

	import type { Connection, Pop, User } from "$lib/types";
	import ConnectionDetails from "$lib/ConnectionDetails.svelte";

	let { data } = $props();
	const origin = $derived(data.origin);
	const pops = $derived(data.pops);
	const exchanges = $derived(data.exchanges);
	const connections = $derived(data.connections);
	const providers = $derived(data.providers);
	const popsJson = $derived(data.popsJson);
	const connectionsJson = $derived(data.connectionsJson);

	let logged_in = $state(false);

	let current_pop: Pop | null = $state(null);
	let current_connection: Connection | null = $state(null);

	let login_open = $state(false);
	let create_open = $state(false);

	let map: Map;

	onMount(() => {
		const stored = sessionStorage.getItem("user");

		if (stored !== null) {
			try {
				$user = JSON.parse(stored);
				logged_in = true;
			} catch {
				console.log("User JSON could not be parsed, resetting");
				sessionStorage.removeItem("user");
			}
		}

		user.subscribe((value) => sessionStorage.setItem("user", JSON.stringify(value)));

		const refresh = setInterval(() => {
			invalidateAll();
		}, 30_000);

		return () => {
			clearInterval(refresh);
		};
	});

	async function login(username: string, password: string) {
		const auth = { username, password };
		const result = await authRequest(`${origin}/auth`, { user: auth });

		if (result.ok) {
			$user = auth;
			logged_in = true;
			login_open = false;
		} else {
			console.log("Login failed");
		}
	}

	async function addPop(id: string, fac: string) {
		const pop = { id, fac };
		await authRequest(`${origin}/pop`, { body: JSON.stringify(pop) });
		await invalidateAll();
		create_open = false;
		map.update();
	}

	async function updatePop(id: string, provider: string) {
		const body = { id, provider };
		await authRequest(`${origin}/pop`, { body: JSON.stringify(body), method: "PATCH" });
		await invalidateAll();
		selectPop(id);
		map.update();
	}

	async function removePop(id: string) {
		const body = { id };
		await authRequest(`${origin}/pop`, { body: JSON.stringify(body), method: "DELETE" });
		await invalidateAll();
		deselectPop();
		map.update();
	}

	async function addConnection(pop1: string, pop2: string, provider: string, cable: string) {
		const connection = { start: pop1, end: pop2, provider, cable };
		await authRequest(`${origin}/connection`, { body: JSON.stringify(connection) });
		await invalidateAll();
		create_open = false;
		map.update();
	}

	async function updateConnection(id: number, provider: string, cable: string, route: string) {
		const body = { id, provider, cable, route };
		await authRequest(`${origin}/connection`, { body: JSON.stringify(body), method: "PATCH" });
		await invalidateAll();
		selectPop(current_pop!.id);
		map.update();
	}

	async function removeConnection(id: number) {
		const connection = { id };
		await authRequest(`${origin}/connection`, { body: JSON.stringify(connection), method: "DELETE" });
		await invalidateAll();
		deselectConnection();
		map.update();
	}

	async function addExchange(pop: string, id: number) {
		const body = { pop, id };
		await authRequest(`${origin}/exchange`, { body: JSON.stringify(body) });
		await invalidateAll();
		selectPop(pop);
		map.update();
	}

	async function removeExchange(pop: string, id: number) {
		const body = { pop, id };
		await authRequest(`${origin}/exchange`, { body: JSON.stringify(body), method: "DELETE" });
		await invalidateAll();
		selectPop(pop);
		map.update();
	}

	function selectPop(id: string) {
		current_pop = pops.find(pop => pop.id === id) || null;
	}

	function deselectPop() {
		current_pop = null;
	}

	function selectConnection(connection: Connection) {
		current_connection = connection;
	}

	function deselectConnection() {
		current_connection = null;
	}

	function authRequest(url: string, options: { user?: User, body?: string, method?: string } = {}) {
		let auth = $user;

		if (options.user !== undefined) {
			auth = options.user;
		}

		const b64 = btoa(`${auth.username}:${auth.password}`);
		return fetch(url, { headers: { Authorization: `Basic ${b64}` }, method: options.method || "POST", body: options.body });
	}
</script>

<svelte:head>
    <title>ISP Map</title>
</svelte:head>

{#if login_open}
	<Login submit={login} close={() => login_open = false} />
{/if}

{#if logged_in}
	<button class="right-btn create" onclick={() => create_open = !create_open} aria-label="Create new PoP">
		<i class="fa-solid fa-plus icon" style="rotate: {create_open ? 45 : 0}deg"></i>
	</button>
{:else}
	<button class="right-btn" onclick={() => login_open = true}>
		<i class="fa-solid fa-user"></i> Login
	</button>
{/if}

{#if create_open}
	<Create {pops} {providers} {addPop} {addConnection} />
{/if}

{#if current_pop != null}
	<PopDetails {pops} {exchanges} {providers} {current_pop} {logged_in} {updatePop} {removePop} {addExchange} {removeExchange} />
{/if}

{#if current_connection != null}
	<ConnectionDetails {providers} {current_connection} {logged_in} {removeConnection} {updateConnection} />
{/if}

<Map {pops} {connections} {providers} {popsJson} {connectionsJson} {selectPop} {deselectPop} {selectConnection} {deselectConnection} bind:this={map} />

<style lang="scss">
	.create {
		height: 2rem;
		width: 2rem;
		padding: 0 !important;
    }

    .right-btn {
        position: absolute;
        z-index: 1;
        top: 1rem;
        right: 1rem;
        background-color: white;
        border: none;
        border-radius: .25rem;
	  	padding: .65rem;
        cursor: pointer;
        box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, 0.2);
    }

	.icon {
		transition: all .1s ease-in;
	}

    :global(body) {
		font-family: sans-serif;
    }

	:global(input) {
		padding: .3rem;
		margin-bottom: .75rem;
		border-style: solid;
		border-radius: .25rem;
	}

	:global(select) {
		padding: .3rem;
		margin-bottom: .75rem;
		border-style: solid;
		border-radius: .25rem;
	}

	:global(button) {
		border: none;
		border-radius: .25rem;
		padding: .3rem;
		cursor: pointer;
		transition: background-color .1s ease-in;
	}

    :global(p) {
		margin: 0;
    }

    :global(ul) {
		margin: 0;
		padding-left: 1rem;
    }

	:global(a) {
		color: #6D28D9;
	}
</style>
