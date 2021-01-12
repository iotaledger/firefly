<script>
    import { getContext } from 'svelte';
    import { Icon, Text } from 'shared/components';

    export let settings
    export let locale
    export let titles
    export let icons
    export let onSettingClick = () => {}

    const route = getContext('route')

    function changeRoute(setting) {
        document.getElementById('scroller').scrollTop = 0
        route.update(() => setting)
    }
</script>

<div class="flex flex-col w-1/3 h-full justify-start items-start">
    {#each Object.values(titles) as setting}
        <div class='flex flex-col w-40 items-start'>
            <button class="mb-1 pl-7 relative" on:click={() => changeRoute(setting)}>
                {#if $route === setting}
                    <Icon width="30" height="30" icon="chevron-right" classes="text-blue-500 absolute left-0 text-xl" />
                {/if}
                <Text type="p" classes="mb-1">
                    {locale(`views.settings.${setting}.title`)}
                </Text>
            </button>
            {#if $route === setting}
                {#each Object.values(settings[$route]) as setting, i}
                    <button on:click={() => onSettingClick(setting)} class="group flex flex-row justify-start items-center hover:bg-blue-50 py-2 rounded-lg w-full ml-6 {Object.values(settings[$route]).length - 1 === i && "mb-4"}">
                        <Icon icon={icons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
                        <Text type="p" classes="group-hover:text-blue-500">{locale(`views.settings.${setting}.title`)}</Text>
                    </button>
                {/each}
            {/if}
        </div>
    {/each}
</div>
