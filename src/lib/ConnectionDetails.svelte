<script lang="ts">
	import type { ConnectionDetailsProps } from "$lib/types";

	let { providers, current_connection, logged_in, removeConnection, updateConnection }: ConnectionDetailsProps = $props();

	let connection = $derived(current_connection);
	let current_provider = $derived(current_connection.provider);

	let provider = $state("");
	let cable = $state("");
	let route = $derived(JSON.stringify(connection.route.coordinates, null, 2));

	$effect(() => {
		if (current_provider) provider = current_provider;
	});

	function selectProvider() {
		updateConnection({ id: connection.id, provider });
	}

	function updateRoute() {
		const input = connection.route;
		input.coordinates = JSON.parse(route);
		updateConnection({ id: connection.id, route: JSON.stringify(input) });
	}
</script>

<div class="details">
	<p>
		<b>{connection.name}</b>
		{#if logged_in}
			<button class="delete" onclick={() => removeConnection(connection.id)} aria-label="Remove PoP"><i class="fa-solid fa-trash-can"></i></button>
		{/if}
	</p>

	<br /><b>Provider:</b>
	{#if logged_in}
		<select name="provider" id="provider" bind:value={provider} onchange={selectProvider}>
			<option value="" selected>No provider selected</option>
			{#each providers as provider (provider.id)}
				<option value={provider.id}>{provider.name}</option>
			{/each}
		</select>
	{:else}
		<span>{providers.find((provider) => provider.id === current_provider)?.name || "None"}</span>
		<br />
	{/if}

	{#if connection.cable}
		<p><b>Cable:</b> {connection.cable}</p>
	{/if}

	{#if logged_in}
		<p class="route-label"><b>Route:</b></p>
		<code><textarea class="route" bind:value={route}></textarea></code>
		<button onclick={updateRoute}>Update connection</button>
	{/if}
</div>

<style lang="scss">
	.details {
		position: absolute;
		z-index: 1;
		top: 1rem;
		left: 1rem;
		width: 16rem;
		padding: 0.75rem;
		border-radius: 0.25rem;
		background-color: white;
		font-size: 0.85rem;
		line-height: 1.5rem;
		box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
	}

	.route-label {
		margin-top: 0.75rem;
	}

	.route {
		width: 100% !important;
		height: 10rem;
		min-height: 5rem;
		max-height: 20rem;
		margin-bottom: 0.5rem;
		border-radius: 5px;
		border: 1px solid #ddd;
	}

	.delete {
		background-color: white;
		color: grey;
		position: absolute;
		right: 0.25rem;
		padding: 0.25rem;
	}
</style>
