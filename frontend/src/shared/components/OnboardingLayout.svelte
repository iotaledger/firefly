<script>
    import { Logo, Icon } from '@shared-components'
    export let allowBack = true
    export let onBackClick
</script>

<style type="text/scss">
    leftpane {
        width: 430px;
    }
    rightpane {
        background-color: var(--element-bg-color);
    }

    :global(.back svg) {
        cursor: pointer;
    }
    :global(.back svg path) {
        fill: var(--ui-blue-color);
    }
</style>

<div class="w-full h-full flex flex-row">
    <leftpane class="flex flex-col flex-shrink-0 justify-between pt-12 pb-16 px-12">
        <div class="flex flex-col">
            <div class="w-full mb-10">
                {#if allowBack}
                    <div class="back" on:click={onBackClick}>
                        <Icon icon="arrow-left" />
                    </div>
                {:else}
                    <Logo width="64px" logo="logo-firefly" />
                {/if}
            </div>
            <leftpane-content>
                <slot name="leftpane__content" />
            </leftpane-content>
        </div>
        <leftpane-action>
            <slot name="leftpane__action" />
        </leftpane-action>
    </leftpane>
    <rightpane class="w-full">
        <slot name="rightpane" />
    </rightpane>
</div>
