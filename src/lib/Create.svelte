<script lang="ts">
	import { createEventDispatcher } from "svelte";

	let id: string;
	let fac: string;

	const dispatch = createEventDispatcher();

	const submit = () => dispatch("submit", { id, fac: Number.parseInt(fac) });
</script>

<form class="create" on:submit|preventDefault={submit}>
	<input bind:value={id} placeholder="ID">
	<input bind:value={fac} placeholder="Facility Code">
	<button type="submit">Create POP</button>
</form>

<style>
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
</style>
