<script lang="ts">
	import { Show } from 'svelte-clerk';
</script>

<h1>Welcome</h1>

<Show when="signed-in">
	<p>You are signed in!</p>
</Show>

<Show when="signed-out">
	<p>You are not signed in!</p>
</Show>
