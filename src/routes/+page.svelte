<script lang="ts">
	import "normalize.css/normalize.css";
	import "@fortawesome/fontawesome-free/css/fontawesome.css";
	import "@fortawesome/fontawesome-free/css/solid.css";
	import "mapbox-gl/dist/mapbox-gl.css";

	import { onMount } from "svelte";

	import { invalidateAll } from "$app/navigation";

	import Map from "$lib/Map.svelte";
	import Details from "$lib/Details.svelte";
	import Login from "$lib/Login.svelte";
	import Create from "$lib/Create.svelte";

	import { user } from "$lib/stores";

	import type { ModifyAdjacency, ModifyExchange, AddPop, Pop, User, RemovePop } from "$lib/types";

	export let data;
	$: origin = data.origin;
	$: pops = data.pops;
	$: exchanges = data.exchanges;
	$: popsJson = data.popsJson;
	$: connectionsJson = data.connectionsJson;

	let logged_in = false;

	let selected = false;
	let current_pop: Pop;

	let login_open = false;
	let create_open = false;

	let updateMap: () => void;

	onMount(() => {
		const stored = sessionStorage.getItem("user");

		if (stored !== null) {
			try {
				$user = JSON.parse(stored);
				logged_in = true;
			} catch (e) {
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

	async function login(event: CustomEvent<User>) {
		const auth = event.detail;
		const result = await authRequest(`${origin}/auth`, { user: auth });

		if (result.ok) {
			$user = auth;
			logged_in = true;
			login_open = false;
		} else {
			console.log("Login failed");
		}
	}

	async function addPop(event: CustomEvent<AddPop>) {
		const pop = event.detail;
		await authRequest(`${origin}/pop`, { body: JSON.stringify(pop) });
		await invalidateAll();
		create_open = false;
		updateMap();
	}

	async function removePop(event: CustomEvent<RemovePop>) {
		const pop = event.detail;
		await authRequest(`${origin}/pop`, { body: JSON.stringify(pop), method: "DELETE" });
		await invalidateAll();
		selected = false;
		updateMap();
	}

	async function addAdjacency(event: CustomEvent<ModifyAdjacency>) {
		const details = event.detail;
		await authRequest(`${origin}/connection`, { body: JSON.stringify({ start: details.pop, end: details.adjacency })});
		await invalidateAll();
		selected = false;
		updateMap();
	}

	async function removeAdjacency(event: CustomEvent<ModifyAdjacency>) {
		const details = event.detail;
		await authRequest(`${origin}/connection`, { body: JSON.stringify({ start: details.pop, end: details.adjacency }), method: "DELETE"});
		await invalidateAll();
		selected = false;
		updateMap();
	}

	async function addExchange(event: CustomEvent<ModifyExchange>) {
		const exchange = event.detail;
		await authRequest(`${origin}/exchange`, { body: JSON.stringify(exchange) });
		await invalidateAll();
		selected = false;
		updateMap();
	}

	async function removeExchange(event: CustomEvent<ModifyExchange>) {
		const exchange = event.detail;
		await authRequest(`${origin}/exchange`, { body: JSON.stringify(exchange), method: "DELETE" });
		await invalidateAll();
		selected = false;
		updateMap();
	}

	function selectPop(event: CustomEvent<Pop>) {
		selected = true;
		current_pop = event.detail;
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
	<Login on:submit={login} on:close={() => login_open = false} />
{/if}

{#if logged_in}
	<button class="right-btn create" on:click={() => create_open = !create_open}>
		<i class="fa-solid fa-plus icon" style="rotate: {create_open ? 45 : 0}deg"></i>
	</button>
{:else}
	<button class="right-btn" on:click={() => login_open = true}>
		<i class="fa-solid fa-user"></i> Login
	</button>
{/if}

{#if create_open}
	<Create on:submit={addPop} />
{/if}

{#if selected}
	<Details {pops} {exchanges} {current_pop} {logged_in} on:removePop={removePop} on:addAdjacency={addAdjacency} on:removeAdjacency={removeAdjacency} on:addExchange={addExchange} on:removeExchange={removeExchange} />
{/if}

<Map {pops} {popsJson} {connectionsJson} on:select={selectPop} on:deselect={() => selected = false} bind:update={updateMap} />

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

	:global(input) {
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
</style>
