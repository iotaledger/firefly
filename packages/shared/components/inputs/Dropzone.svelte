<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from '@core/i18n'

    export let extentionsLabel = ''
    export let allowedExtensions: string[]
    export let dropping = false
    export let fileName = ''

    export let onDrop: (event?: Event) => void

    function onEnter(): void {
        dropping = true
    }

    function onLeave(): void {
        dropping = false
    }
</script>

<dropzone
    class="flex items-center justify-center p-7 w-full rounded-lg border border-solid bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
    on:drop={onDrop}
    on:dragenter={onEnter}
    on:dragleave={onLeave}
    on:dragover|preventDefault
>
    <content class:dropping class="flex flex-col items-center relative text-center">
        {#if dropping}
            <Text type="p" secondary smaller>{localize('actions.dropHere')}</Text>
        {:else if fileName}
            <Text type="p" secondary smaller>{fileName}</Text>
        {:else}
            <svg
                class="block mt-4 mb-8"
                width="50"
                height="34"
                viewBox="0 0 50 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    class="text-blue-500 fill-current"
                    d="M0 25C0 29.6326 3.50005 33.4476 8 33.9451V34H21C22.1046 34 23 33.1046 23 32V17.6445L17.6782 22.556C17.2724
                    22.9306 16.6397 22.9052 16.2651 22.4993C15.8906 22.0935 15.9159 21.4608 16.3218 21.0863L24 14L31.6782
                    21.0863C32.0841 21.4608 32.1094 22.0935 31.7349 22.4993C31.3603 22.9052 30.7276 22.9306 30.3218 22.556L25
                    17.6445L25 32C25 33.1045 25.8954 34 27 34L38 34C44.6274 34 50 28.6274 50 22C50 15.658 45.0802 10.4651 38.8489
                    10.0296C36.4827 4.15025 30.726 0 24 0C15.1634 0 8 7.16344 8 16L8.00009 16.0549C3.5001 16.5523 0 20.3674 0 25Z"
                />
            </svg>
            <input
                class="absolute opacity-0 w-full h-full"
                type="file"
                on:change={onDrop}
                accept={allowedExtensions ? allowedExtensions.map((e) => `.${e}`).join(',') : '*'}
            />
            <Text type="h4">{localize('actions.dragDrop')}</Text>
            <Text classes="mb-12" type="p" secondary smaller>{extentionsLabel}</Text>
            <Button outline onClick={onDrop}>{localize('actions.chooseFile')}</Button>
        {/if}
    </content>
</dropzone>

<style type="text/scss">
    dropzone {
        height: 290px;
        content {
            &.dropping {
                @apply pointer-events-none;
            }
            * {
                @apply cursor-pointer;
            }
        }
    }
</style>
