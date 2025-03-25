<script lang="ts">
	import type { ConnectionDetailsProps } from "$lib/types";

	let { cables, current_connection, logged_in, removeConnection }: ConnectionDetailsProps = $props();

	const connection = current_connection;
	const cable = cables.features.find(cable => cable.properties?.id === connection.cable);

	// let provider = $state("");
	// let cable = $state("");
</script>

<div class="details">
	<p>
		<b>{connection.start} - {connection.end}</b>
		{#if logged_in}
			<button class="delete" onclick={() => removeConnection(connection.start, connection.end)} aria-label="Remove PoP"><i class="fa-solid fa-trash-can"></i></button>
		{/if}
	</p>
	<p><b>Provider:</b> {connection.provider}</p>

	{#if connection.cable}
		<p><b>Cable:</b> {cable?.properties?.name}</p>
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
