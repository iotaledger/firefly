<script lang="typescript">
    import { Icon } from 'shared/components'
    import Error from './Error'
    export let address = undefined
    export let classes = ''
    export let locale = undefined
    export let error = ''
</script>

<style type="text/scss">
    address-input {
        display: flex;
        position: relative;
        textarea {
            color: var(--text-secondary-color);
            background: var(--element-bg-color);
            border-radius: 10px;
            box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
            resize: none;
        }
    }
</style>

<div>
    <address-input class={classes}>
        <textarea 
            bind:value={address} 
            placeholder={locale('general.add_address')} 
            class={`w-full relative text-12 leading-140 py-4 pr-8 pl-4 bg-white border border-solid ${classes} ${error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-500 focus:border-gray-500'} rounded-xl text-gray`}
        />
    </address-input>
    <Error {error}/>
</div>
