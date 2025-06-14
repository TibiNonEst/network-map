<script lang="ts">
	import type { PopDetailsProps } from "$lib/types";

	let { connections, exchanges, providers, current_pop, logged_in, updatePop, removePop, addExchange, removeExchange }: PopDetailsProps = $props();

	let current_provider = $derived(current_pop.provider);

	let provider = $state("");
	let new_exchange = $state("");

	$effect(() => {
		if (current_provider) provider = current_provider;
	});

	function submitAddExchange(event: SubmitEvent) {
		event.preventDefault();

		addExchange(current_pop.id, Number.parseInt(new_exchange));

		// @ts-expect-error
		event.currentTarget.reset();
	}

	function selectProvider() {
		updatePop(current_pop.id, provider);
	}
</script>

<div class="details">
	<p>
		<b>{current_pop.name}</b>
		{#if logged_in}
			<button class="delete" onclick={() => removePop(current_pop.id)} aria-label="Remove PoP"><i class="fa-solid fa-trash-can"></i></button>
		{/if}
	</p>
	<p>{current_pop.location}</p>
	<p>{current_pop.id} | <a href="https://www.peeringdb.com/fac/{current_pop.fac}">PeeringDB</a></p>

	<br /><b>Provider:</b>
	{#if logged_in}
		<select name="provider" id="provider" bind:value={provider} onchange={selectProvider}>
			<option value="" selected>No provider selected</option>
			{#each providers as provider, idx (provider.name)}
				<option value={idx}>{provider.name}</option>
			{/each}
		</select>
	{:else}
		<span>{current_provider || "None"}</span>
		<br />
	{/if}

	{#if current_pop.connections.length > 0}
		<br /><b>Connections:</b>
		<ul>
			{#each current_pop.connections as id (id)}
				<li title={`${id}`}>
					{connections.find((connection) => connection.id === id)?.name}
				</li>
			{/each}
		</ul>
	{/if}

	{#if current_pop.exchanges.length > 0 || logged_in}
		<br /><b>Exchanges:</b>
		<ul>
			{#each current_pop.exchanges as id (id)}
				<li>
					<a href="https://www.peeringdb.com/ix/{id}">{exchanges.find((ix) => ix.id === id)?.name}</a>
					{#if logged_in}
						<button class="delete" onclick={() => removeExchange(current_pop.id, id)} aria-label="Remove exchange"
							><i class="fa-solid fa-plus"></i></button
						>
					{/if}
				</li>
			{/each}
			{#if logged_in}
				<li>
					<form onsubmit={submitAddExchange}>
						<input bind:value={new_exchange} placeholder="New exchange" />
					</form>
				</li>
			{/if}
		</ul>
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

		.fa-plus {
			rotate: 45deg;
		}
	}

	input {
		border: none;
		padding: 0;
		margin-bottom: 0;
		width: 100%;
	}
</style>
