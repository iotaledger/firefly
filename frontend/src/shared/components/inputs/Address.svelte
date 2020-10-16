<script>
    import { Icon } from '@shared-components'
    export let address
    export let classes
    export let locale
</script>

<style type="text/scss">
    address-input {
        display: block;
        position: relative;
        textarea {
            resize: none;
            min-height: 72px;
            width: 100%;
            padding: 19px 50px 19px 13px;
            color: var(--text-secondary-color);
            background: var(--element-bg-color);
            border-color: var(--line-separator-color);
            border-radius: 10px;
            box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
            font-size: 12px;
            line-height: 140%;
            font-weight: 700;
        }
        :global(svg.right) {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 12px;
        }
        :global(svg.right path) {
            fill: var(--button-secondary-icon-color);
        }
    }
</style>

<address-input class={classes}>
    <textarea bind:value={address} placeholder={locale('general.add_address')} />
    <Icon icon="qr" classes="right" />
</address-input>
