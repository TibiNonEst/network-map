<script lang="ts">
	import type { CreateProps } from "$lib/types";

	let type = $state("pop");

	let id = $state("");
	let fac = $state("");

	let pop1 = $state("");
	let pop2 = $state("");
	let provider = $state("");
	let cable = $state("");
	let segments = $state([]);

	let { pops, providers, cables, addPop, addConnection }: CreateProps = $props();

	let segmentData = $derived(cables.features.find((c) => c.properties?.id === cable)?.geometry.coordinates || []);

	const orderedPops = pops.toSorted((pop1, pop2) => pop1.id.localeCompare(pop2.id));
	const orderedCables = cables.features.toSorted((cable1, cable2) => cable1.properties?.name.localeCompare(cable2.properties?.name));
	const normalizedProviders = providers.map((provider) => provider.replaceAll("_", " "));

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (type === "pop") {
			addPop(id, fac);
		} else {
			addConnection(pop1, pop2, provider, cable, segments);
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
			{#each normalizedProviders as provider}
				<option value={provider}>{provider}</option>
			{/each}
		</select>
		<select name="cable" id="cable" bind:value={cable}>
			<option value="" disabled selected hidden>Select cable (optional)</option>
			{#each orderedCables as cable}
				<option value={cable.properties?.id}>{cable.properties?.name}</option>
			{/each}
		</select>
		{#if cable}
			<div class="segments">
				{#each segmentData as segment, idx}
					<input type="checkbox" value={idx} id={"s" + idx} bind:group={segments}>
					<label for={"s" + idx}>{idx}</label>
				{/each}
			</div>
		{/if}
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

	.segments {
		display: flex;

		label {
			margin-right: .25rem;
		}
	}

	input[type=radio] {
		display: none;
	}
</style>
