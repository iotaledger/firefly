<script lang="typescript">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { selectedAccount } from '@core/account'
    import { Icon } from 'shared/components'
    import { AccountLabel } from 'shared/components/atoms/'

    function onClick(): void {}
</script>

<button on:click={onClick} class="flex flex-row justify-center items-center space-x-2">
    <AccountLabel account={$selectedAccount} />
    <div class="rotate-180">
        <Icon height="18" width="18" icon={IconEnum.ChevronDown} classes="text-gray-500 dark:text-white" />
    </div>
</button>
