<script lang="ts">
	import type { CreateProps } from "$lib/types";

	let type = $state("pop");

	let id = $state("");
	let fac = $state("");

	let pop1 = $state("");
	let pop2 = $state("");
	let provider = $state("");
	let cable = $state("");

	let name = $state("");
	let color = $state("");

	let { pops, providers, addPop, addConnection, addProvider }: CreateProps = $props();

	const orderedPops = pops.toSorted((pop1, pop2) => pop1.id.localeCompare(pop2.id));
	const orderedProviders = providers.toSorted((provider1, provider2) => provider1.name.localeCompare(provider2.name));

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		switch (type) {
			case "pop":
				addPop(id, Number.parseInt(fac));
				break;
			case "connection":
				addConnection(pop1, pop2, provider, cable);
				break;
			case "provider":
				addProvider(name, color);
				break;
			default:
				console.log(`Unknown type "${type}"`);
		}
	}
</script>

<form class="create" {onsubmit}>
	<div class="type">
		<input type="radio" id="pop" name="type" value="pop" bind:group={type} />
		<label for="pop">PoP</label>
		<input type="radio" id="connection" name="type" value="connection" bind:group={type} />
		<label for="connection">Connection</label>
		<input type="radio" id="provider" name="type" value="provider" bind:group={type} />
		<label for="provider">Provider</label>
	</div>
	{#if type === "pop"}
		<input bind:value={id} placeholder="ID" required />
		<input bind:value={fac} placeholder="Facility Code" required />
		<button type="submit">Create PoP</button>
	{:else if type === "connection"}
		<select name="pop1" id="pop1" bind:value={pop1} required>
			<option value="" disabled selected hidden>Select PoP 1</option>
			{#each orderedPops as pop (pop.id)}
				<option value={pop.id}>{pop.id}</option>
			{/each}
		</select>
		<select name="pop2" id="pop2" bind:value={pop2} required>
			<option value="" disabled selected hidden>Select PoP 2</option>
			{#each orderedPops as pop (pop.id)}
				<option value={pop.id}>{pop.id}</option>
			{/each}
		</select>
		<select name="provider" id="provider" bind:value={provider} required>
			<option value="" disabled selected hidden>Select provider</option>
			{#each orderedProviders as provider (provider.id)}
				<option value={provider.id}>{provider.name}</option>
			{/each}
		</select>
		<input bind:value={cable} placeholder="Cable" />
		<button type="submit">Create Connection</button>
	{:else if type === "provider"}
		<input bind:value={name} placeholder="Name" required />
		<input bind:value={color} placeholder="Color" required />
		<button type="submit">Create Provider</button>
	{:else}
		<p>Error: unknown type "{type}""</p>
	{/if}
</form>

<style lang="scss">
	.create {
		position: absolute;
		z-index: 1;
		top: 4rem;
		right: 1rem;
		background-color: white;
		border: none;
		border-radius: 0.25rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
	}

	.type {
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 1rem;

		label {
			color: #333;
			cursor: pointer;
		}

		input:checked + label {
			border-bottom: 2px lightgrey solid;
		}
	}

	input[type="radio"] {
		display: none;
	}
</style>
