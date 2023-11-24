<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import type { Exchange, Pop } from "$lib/types";

	export let pops: Pop[];
	export let exchanges: Exchange[];

	export let current_pop: Pop;
	export let logged_in: boolean;

	let new_adjacency: string;
	let new_exchange: string;

	const dispatch = createEventDispatcher();

	const removePop = () => dispatch("removePop", { id: current_pop.id });

	const addAdjacency = () => dispatch("addAdjacency", { pop: current_pop.id, adjacency: new_adjacency });
	const removeAdjacency = (adjacency: string) => dispatch("removeAdjacency", { pop: current_pop.id, adjacency: adjacency });

	const addExchange = () => dispatch("addExchange", { pop: current_pop.id, id: Number.parseInt(new_exchange) });
	const removeExchange = (exchange: number) => dispatch("removeExchange", { pop: current_pop.id, id: exchange });
</script>



<div class="details">
	<p>
		<b>{current_pop.name}</b>
		{#if logged_in}
			<button class="delete" on:click={removePop}><i class="fa-solid fa-trash-can"></i></button>
		{/if}
	</p>
	<p>{current_pop.location}</p>
	<p>{current_pop.id} | <a href="https://www.peeringdb.com/fac/{current_pop.fac}">PeeringDB</a></p>

	{#if current_pop.adjacencies.length > 0 || logged_in}
		<br><b>Adjacencies:</b>
		<ul>
			{#each current_pop.adjacencies as id}
				<li>
					{pops.find(pop => pop.id === id)?.name}
					{#if logged_in}
						<button class="delete" on:click={() => removeAdjacency(id)}><i class="fa-solid fa-plus"></i></button>
					{/if}
				</li>
			{/each}
			{#if logged_in}
				<li>
					<form on:submit|preventDefault={addAdjacency}>
						<input bind:value={new_adjacency} placeholder="New adjacency">
					</form>
				</li>
			{/if}
		</ul>
	{/if}

	{#if current_pop.exchanges.length > 0 || logged_in}
		<br><b>Exchanges:</b>
		<ul>
			{#each current_pop.exchanges as id}
				<li>
					<a href="https://www.peeringdb.com/ix/{id}">{exchanges.find(ix => ix.id === id)?.name}</a>
					{#if logged_in}
						<button class="delete" on:click={() => removeExchange(id)}><i class="fa-solid fa-plus"></i></button>
					{/if}
				</li>
			{/each}
			{#if logged_in}
				<li>
					<form on:submit|preventDefault={addExchange}>
						<input bind:value={new_exchange} placeholder="New exchange">
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
