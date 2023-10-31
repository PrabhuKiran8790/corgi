<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { FileText } from 'lucide-svelte';

	const styles = {
		label: 'PDF Chat',
		icon: FileText,
		href: '/dashboard/pdf',
		color: 'text-blue-500',
		background_color: 'bg-blue-100 dark:bg-blue-500/20',
		status: 'soon',
		description: 'Chat with your PDFs',
		pro_description: 'Unlimited'
	};
</script>

<div class="h-full p-4 flex items-center justify-center">
	<Card.Root class="w-[380px]">
		<Card.Header>
			<div class="flex items-center gap-4">
				<div>
					<svelte:component
						this={styles.icon}
						class={cn(styles.background_color, styles.color, 'w-8 h-8 rounded-lg p-1')}
					/>
				</div>
				<div>
					<Card.Title>{styles.label}</Card.Title>
					<Card.Description>{styles.description}</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
            <p>PDF Chat is under construction 🚧</p>
            <p>You'll be notified when it's done.</p>
		</Card.Content>
	</Card.Root>
</div>
