<script lang="typescript">
    import { Input } from 'shared/components'

    export let key = ''
    export let value = ''
</script>

<key-value>
    <Input label={key} bind:value error={''} disabled={true} inputElement={undefined} classes="mb-6" />
</key-value>

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }
    input {
        @apply py-4;
        @apply pr-8;
        @apply pl-3;
        border-radius: 0.625rem; // TODO: add to tailwind
        font-feature-settings: 'calt' off; // disables 'x' formatting while surrounded by numbers

        &::placeholder {
            @apply text-gray-500;
        }

        &:disabled {
            &,
            + floating-label.floating-active {
                @apply pointer-events-none;
                @apply opacity-50;
            }
        }

        &.floating-active {
            @apply pt-6;
            @apply pb-2;
        }

        + floating-label {
            transform: translateY(3px);
            @apply block;
            @apply text-gray-500;
            @apply text-11;
            @apply leading-120;
            @apply overflow-hidden;
            @apply opacity-0;
            @apply pointer-events-none;
            @apply absolute;
            @apply left-3;
            @apply select-none;
            @apply whitespace-nowrap;
            @apply w-full;
            @apply transition-none;
            top: 8px;
        }
        &:not(:disabled) {
            + floating-label {
                &.floating-active {
                    @apply transition-all;
                    @apply ease-out;
                    @apply opacity-100;
                    transform: none;
                }
            }
        }

        &:focus {
            + floating-label {
                @apply text-blue-500;
            }
        }
    }
</style>
