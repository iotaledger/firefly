<script lang="ts">
    import { Icon } from '@ui'
    import { localize } from '@core/i18n'
    import { platform, PlatformOption } from '@core/app'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let busy = false
    export let allowBack = true
    export let onBackClick = (): void => {}
</script>

<onboarding-layout data-label="onboarding-layout" class="relative w-full h-full flex flex-row">
    <leftpane-container data-label="leftpane" class="h-full flex justify-center p-12 pt-8 bg-white dark:bg-gray-800">
        <div class="w-full h-full flex flex-col justify-between">
            <div class="flex flex-col h-full">
                <action-placeholder class="block mb-8" class:mt-9={$platform === PlatformOption.MacOs}>
                    {#if allowBack}
                        <button
                            on:click={onBackClick}
                            class:busy
                            disabled={busy}
                            aria-label={localize('actions.back')}
                            type="button"
                        >
                            <icon-container class:busy>
                                <Icon icon={IconEnum.ArrowLeft} />
                            </icon-container>
                        </button>
                    {/if}
                </action-placeholder>
                <leftpane-content-container data-label="leftpane-content" class="h-full flex flex-col">
                    {#if $$slots.title}
                        <div class="mb-5">
                            <slot name="title" />
                        </div>
                    {/if}
                    <slot name="leftpane__content" />
                </leftpane-content-container>
            </div>
            <leftpane-action-container data-label="leftpane-action" class="block">
                <slot name="leftpane__action" />
            </leftpane-action-container>
        </div>
    </leftpane-container>
    <rightpane-container data-label="rightpane" class="block relative bg-gray-100 dark:bg-gray-900">
        <slot name="rightpane" />
    </rightpane-container>
</onboarding-layout>

<style lang="scss">
    leftpane-container {
        width: 38%;

        > div {
            max-width: 406px;
        }
    }

    rightpane-container {
        width: 62%;
    }

    button {
        @apply w-6 h-6;
        transition: filter 0.2s;

        &:focus {
            filter: brightness(1.3);
        }

        &.busy {
            @apply pointer-events-none opacity-50;
        }
    }

    icon-container {
        @apply block cursor-pointer text-blue-500;

        &.busy {
            @apply cursor-default pointer-events-none text-gray-500;
        }
    }
</style>
