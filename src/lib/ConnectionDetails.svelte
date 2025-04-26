<script lang="ts">
	import type { ConnectionDetailsProps } from "$lib/types";

	let { providers, current_connection, logged_in, removeConnection, updateConnection }: ConnectionDetailsProps = $props();

	let connection = $derived(current_connection);
	let current_provider = $derived(current_connection.provider);

	let provider = $state("");
	let cable = $state("");
	let route_string = $state("");

	$effect(() => {
		if (current_provider) provider = current_provider;
		console.log(provider);
	});

	function selectProvider() {
		updateConnection(connection.id, provider, cable, route_string);
	}
</script>

<div class="details">
	<p>
		<b>{connection.start} - {connection.end}</b>
		{#if logged_in}
			<button class="delete" onclick={() => removeConnection(connection.id)} aria-label="Remove PoP"><i class="fa-solid fa-trash-can"></i></button>
		{/if}
	</p>

	<br><b>Provider:</b>
	{#if logged_in}
		<select name="provider" id="provider" bind:value={provider} onchange={selectProvider}>
			<option value={""} selected>No provider selected</option>
			{#each providers as provider}
				<option value={provider.name}>{provider.name}</option>
			{/each}
		</select>

		<br><b>Route</b>
		<textarea name="route" id="route" bind:value={route_string}>New GeoJSON</textarea>
	{:else}
		<span>{current_provider || "None"}</span>
		<br>
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
    width: 15rem;
    padding: .75rem;
    border-radius: .25rem;
    background-color: white;
    font-size: .85rem;
    line-height: 1.5rem;
    box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, 0.2);
  }

  .delete {
	background-color: white;
	color: grey;
	position: absolute;
	right: .25rem;
	padding: .25rem;
  }
</style>
