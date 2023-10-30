<script>
	import corgiTyping from '$lib/assets/corgi-typing.jpeg';
</script>

<body class="bg-[#000009] overflow-x-hidden">
	<div class="h-screen">
		<div class="grid grid-cols-1 lg:grid-cols-2 h-full">
			<div class="w-full px-5">
				<div class="flex items-center justify-center h-full">
					<img src={corgiTyping} alt="corgi" class="w-1/3 lg:w-1/2" />
					<h1 class="text-start text-5xl md:text-8xl gfont text-white">Corgi</h1>
				</div>
			</div>
			<div class="h-full w-full">
				<div class="flex items-center justify-center h-full -mt-12 md:mt-0">
					<slot />
				</div>
			</div>
		</div>
	</div>
</body>
