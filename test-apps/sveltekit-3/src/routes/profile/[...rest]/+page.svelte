<script lang="ts">
	import { Show, useClerkContext, UserProfile } from 'svelte-clerk';

	const ctx = useClerkContext();
</script>

<Show when="signed-in">
	<UserProfile />
	<p>User ID: {ctx.user?.emailAddresses[0].emailAddress}</p>
</Show>
