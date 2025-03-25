<script lang="ts">
	import { fade } from "svelte/transition";
	import type { LoginProps } from "$lib/types";

	let username = $state("");
	let password = $state("");

	let { close, submit }: LoginProps = $props();

	const onClose = () => close();
	function onSubmit (event: SubmitEvent) {
		event.preventDefault();
		submit(username, password);
	}
</script>

<div class="login">
	<div class="shade" onclick={onClose} aria-hidden="true" transition:fade={{duration: 50}}></div>

	<div class="modal" transition:fade={{duration: 50}}>
		<h2>Login</h2>
		<form onsubmit={onSubmit}>
			<input bind:value={username} placeholder="Username">
			<input bind:value={password} type="password" placeholder="Password">
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
