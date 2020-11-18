<script>
    import { Logo, Icon } from '@shared-components'
</script>

<style type="text/scss">
    :global(svg path) {
        fill: var(--text-secondary-color); // TODO: tailwindify
    }
</style>

<aside class="flex flex-col justify-center items-center bg-white h-screen relative w-20 px-5 py-6">
    <Logo classes="mb-10" width="48px" logo="logo-firefly" />
    <nav class="flex flex-grow flex-col justify-between">
        <div>
            <Icon icon="wallet" />
        </div>
        <div>
            <Icon classes="mb-8" icon="bell" />
            <Icon icon="settings" />
        </div>
    </nav>
</aside>
