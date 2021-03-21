<script lang="typescript">
    import { Electron } from 'shared/lib/electron'
    import { wallet } from 'shared/lib/wallet'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    let os = ''

    onMount(async () => {
        os = await Electron.getOS()
        document.body.classList.add(`platform-${os}`)
    })
</script>

<div class="h-full w-full">
    {#if os === 'win32'}
        <nav
            class={`fixed z-50 left-0 right-0 flex flex-row h-12 justify-between ${get(get(wallet).accountsLoaded) ? 'bg-gray-50' : 'bg-white'} dark:bg-gray-900`}
            style="-webkit-app-region: drag">
            <button
                on:click={() => Electron.popupMenu()}
                class={`flex justify-center p-4 stroke-current text-gray-900 dark:text-gray-100 w-20 ${get(get(wallet).accountsLoaded) ? 'bg-white dark:bg-gray-800 border-solid border-r border-gray-100 dark:border-gray-800' : ''}`}
                style="-webkit-app-region: none">
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path d="M0 1h15v1h-15z" fill="currentColor" />
                    <path d="M0 7h15v1h-15z" fill="currentColor" />
                    <path d="M0 13h15v1h-15z" fill="currentColor" />
                </svg>
            </button>
            <div class="flex flex-row mr-2">
                <button
                    on:click={() => Electron.minimize()}
                    class="p-2 mr-2 stroke-current text-gray-900 dark:text-gray-100"
                    style="-webkit-app-region: none">
                    <svg width="15" height="15" viewBox="0 0 15 15">
                        <path d="M0 12h15v1h-15z" fill="currentColor" />
                    </svg>
                </button>
                <button
                    on:click={() => Electron.maximize()}
                    class="p-2 mr-2 stroke-current text-gray-900 dark:text-gray-100"
                    style="-webkit-app-region: none">
                    <svg width="15" height="15" viewBox="0 0 15 15">
                        <path d="M1 1v13h13v-13h-13zm-1-1h15v15h-15v-15z" fill="currentColor" />
                    </svg>
                </button>
                <button
                    on:click={() => Electron.close()}
                    class="p-2 mr-2 stroke-current text-gray-900 dark:text-gray-100"
                    style="-webkit-app-region: none">
                    <svg width="15" height="15" viewBox="0 0 15 15">
                        <path
                            d="M7.425 6.718l6.718-6.718.707.707-6.718 6.718 6.718 6.718-.707.707-6.718-6.718-6.718 6.718-.707-.707 6.718-6.718-6.718-6.718.707-.707 6.718 6.718z"
                            fill="currentColor" />
                    </svg>
                </button>
            </div>
        </nav>
    {/if}
    {#if os === 'darwin'}
        <div style="-webkit-app-region: drag" class="w-full h-12 fixed left-20" />
    {/if}
    <div class={`fixed ${os === 'win32' ? 'top-12' : 'top-0'} left-0 right-0 bottom-0`}>
        <slot />
    </div>
</div>
