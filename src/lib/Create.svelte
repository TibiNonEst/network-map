<script lang="ts">
	import type { CreateProps } from "$lib/types";

	let type = $state("pop");

	let id = $state("");
	let fac = $state("");

	let pop1 = $state("");
	let pop2 = $state("");
	let provider = $state("");
	let cable = $state("");

	let { pops, providers, addPop, addConnection }: CreateProps = $props();

	const orderedPops = pops.toSorted((pop1, pop2) => pop1.id.localeCompare(pop2.id));

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (type === "pop") {
			addPop(id, fac);
		} else {
			addConnection(pop1, pop2, provider, cable);
		}
	}
</script>

<form class="create" {onsubmit}>
	<div class="type">
		<input type="radio" id="pop" name="type" value={"pop"} bind:group={type}>
		<label for="pop">PoP</label>
		<input type="radio" id="connection" name="type" value={"connection"} bind:group={type}>
		<label for="connection">Connection</label>
	</div>
	{#if type === "pop"}
		<input bind:value={id} placeholder="ID" required>
		<input bind:value={fac} placeholder="Facility Code" required>
		<button type="submit">Create PoP</button>
	{:else}
		<select name="pop1" id="pop1" bind:value={pop1} required>
			<option value="" disabled selected hidden>Select PoP 1</option>
			{#each orderedPops as pop}
				<option value={pop.id}>{pop.id}</option>
			{/each}
		</select>
		<select name="pop2" id="pop2" bind:value={pop2} required>
			<option value="" disabled selected hidden>Select PoP 2</option>
			{#each orderedPops as pop}
				<option value={pop.id}>{pop.id}</option>
			{/each}
		</select>
		<select name="provider" id="provider" bind:value={provider} required>
			<option value="" disabled selected hidden>Select provider</option>
			{#each providers as provider}
				<option value={provider.name}>{provider.name}</option>
			{/each}
		</select>
		<input bind:value={cable} placeholder="Cable">
		<button type="submit">Create Connection</button>
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
        border-radius: .25rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, 0.2);
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

	input[type=radio] {
		display: none;
	}
</style>
