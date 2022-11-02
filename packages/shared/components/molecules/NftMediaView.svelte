<script lang="typescript">
    // Presenting NFT media is not available until E12.M3. For now, use this to
    // display the NftPlaceholder component. Then in E12.M3. we can just update
    // this component to display the NFT media and only display the NftPlaceholder
    // component while we wait for the NFT media to be ready to render.
    import { NftMediaSize, NftPlaceholder } from 'shared/components'

    export let size: NftMediaSize = NftMediaSize.small

    // TODO: Change styling of view depending on size prop

    const isLoaded = false
</script>

<div class="flex w-full items-center justify-center">
    <div class="rounded-2xl flex justify-center items-center transition-none p-2 w-16 h-16 bg-gray-500">
        {#if !isLoaded}
            <!-- TODO: Add NFT to Placeholder parameters -->
            <!-- TODO: Remove size prop and handle within this file -->
            <NftPlaceholder {size} />
        {:else}
            <div>
                <!-- Loaded and Secure NFT Media  -->
            </div>
        {/if}
    </div>
</div>
