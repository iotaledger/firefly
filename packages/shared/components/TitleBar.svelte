<script lang="typescript">
    import { Electron } from 'shared/lib/electron'
    import { onMount } from 'svelte'

    let isWindows = false

    onMount(async () => {
        isWindows = await Electron.getOS()
    })
</script>

<div class="h-full w-full">
    {#if isWindows}
        <nav class="fixed z-50 left-0 right-0 flex flex-row h-10 justify-between" style="-webkit-app-region: drag">
            <button on:click={() => Electron.popupMenu()} class="ml-5 p-2 stroke-current text-gray-900 dark:text-gray-100" style="-webkit-app-region: none">
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path d="M0 1h15v1h-15z" fill="currentColor" />
                    <path d="M0 7h15v1h-15z" fill="currentColor" />
                    <path d="M0 13h15v1h-15z" fill="currentColor" />
                </svg>
            </button>
            <div class="flex flex-row">
                <button on:click={() => Electron.minimize()} class="p-2 stroke-current text-gray-900 dark:text-gray-100" style="-webkit-app-region: none">
                    <svg width="15" height="15" viewBox="0 0 15 15">
                        <path d="M0 12h15v1h-15z" fill="currentColor" />
                    </svg>
                </button>
                <button on:click={() => Electron.maximize()} class="p-2 stroke-current text-gray-900 dark:text-gray-100" style="-webkit-app-region: none">
                    <svg width="15" height="15" viewBox="0 0 15 15">
                        <path d="M1 1v13h13v-13h-13zm-1-1h15v15h-15v-15z" fill="currentColor" />
                    </svg>
                </button>
                <button on:click={() => Electron.close()} class="p-2 stroke-current text-gray-900 dark:text-gray-100" style="-webkit-app-region: none">
                    <svg width="15" height="15" viewBox="0 0 15 15">
                        <path
                            d="M7.425 6.718l6.718-6.718.707.707-6.718 6.718 6.718 6.718-.707.707-6.718-6.718-6.718 6.718-.707-.707 6.718-6.718-6.718-6.718.707-.707 6.718 6.718z"
                            fill="currentColor" />
                    </svg>
                </button>
            </div>
        </nav>
    {/if}
    <slot />
</div>
