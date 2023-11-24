<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	let username: string;
	let password: string;

	const dispatch = createEventDispatcher();

	const submit = () => dispatch("submit", { username, password });
	const close = () => dispatch("close");
</script>

<div class="login">
	<div class="shade" on:click={close} aria-hidden="true" transition:fade={{duration: 50}} />

	<div class="modal" transition:fade={{duration: 50}}>
		<h2>Login</h2>
		<form on:submit|preventDefault={submit}>
			<input bind:value={username} placeholder="Username">
			<input bind:value={password} placeholder="Password">
			<button type="submit">Login</button>
		</form>
	</div>
</div>

<style lang="scss">
	.login {
	  position: absolute;
	  width: 100vw;
	  height: 100vh;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.shade {
      position: absolute;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, .5);
	  cursor: pointer;
      z-index: 3;
    }

	.modal {
	  background-color: white;
	  padding: 1.5rem;
	  border-radius: .5rem;
      z-index: 4;
    }

	h2 {
	  margin-top: 0;
	}

	input {
	  margin-bottom: 0;
	}

	button {
	  line-height: 1.5;
	}
</style>
