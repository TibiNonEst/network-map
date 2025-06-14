<script lang="ts">
	import type { ConnectionDetailsProps } from "$lib/types";

	let { providers, current_connection, logged_in, removeConnection, updateConnection }: ConnectionDetailsProps = $props();

	let connection = $derived(current_connection);
	let current_provider = $derived(current_connection.provider);

	let provider = $state("");
	let cable = $state("");

	$effect(() => {
		if (current_provider) provider = current_provider;
	});

	function selectProvider() {
		updateConnection({ id: connection.id, provider, cable });
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

	.delete {
		background-color: white;
		color: grey;
		position: absolute;
		right: 0.25rem;
		padding: 0.25rem;
	}
</style>
