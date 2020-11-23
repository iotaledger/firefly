<script>
    import { Text, Button } from '@shared-components'

    export let locale = undefined
    export let onDrop = () => {}
    export let extentionsLabel = ''
    export let allowedExtensions = '*'

    let dropping = false
    let fileName = null

    const onFile = (e) => {
        e.preventDefault()
        dropping = false

        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]
        fileName = file.name

        // TODO: should we limit by size?
        if (!file || file.size > 100000) {
            fileName = null
            return onDrop(false)
        }

        const reader = new FileReader()
        reader.fileName = fileName

        reader.onload = (e) => {
            const buffer = e.target.result
            const name = e.target.fileName
            onDrop(buffer, name)
        }

        reader.readAsArrayBuffer(file)
    }

    const onEnter = () => {
        dropping = true
    }

    const onLeave = () => {
        dropping = false
    }
</script>

<style type="text/scss">
    dropzone {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 290px;
        background: var(--element-bg-color);
        background: var(--element-bg-color);
        border-color: var(--line-separator-color);
        box-shadow: 0px 1px 4px rgba(23, 27, 37, 0.04);
        border-radius: 16px;
        padding: 28px;
        content {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            &.dropping {
                pointer-events: none;
            }
            svg {
                display: block;
                margin-bottom: 16px;
                margin-top: 32px;
                path {
                    fill: var(--ui-blue-color);
                }
            }
            input {
                position: absolute;
                opacity: 0;
                width: 100%;
                height: 100%;
            }
            * {
                cursor: pointer;
            }
        }
    }
</style>

<dropzone on:drop={onFile} on:dragenter={onEnter} on:dragleave={onLeave} on:dragover|preventDefault>
    <content class:dropping>
        {#if dropping}
            <Text type="p" secondary>{locale('actions.drop_here')}</Text>
        {:else if fileName}
            <Text type="p" secondary>{fileName}</Text>
        {:else}
            <svg width="50" height="34" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 25C0 29.6326 3.50005 33.4476 8 33.9451V34H21C22.1046 34 23 33.1046 23 32V17.6445L17.6782 22.556C17.2724 22.9306 16.6397 22.9052 16.2651 22.4993C15.8906 22.0935 15.9159 21.4608 16.3218 21.0863L24 14L31.6782 21.0863C32.0841 21.4608 32.1094 22.0935 31.7349 22.4993C31.3603 22.9052 30.7276 22.9306 30.3218 22.556L25 17.6445L25 32C25 33.1045 25.8954 34 27 34L38 34C44.6274 34 50 28.6274 50 22C50 15.658 45.0802 10.4651 38.8489 10.0296C36.4827 4.15025 30.726 0 24 0C15.1634 0 8 7.16344 8 16L8.00009 16.0549C3.5001 16.5523 0 20.3674 0 25Z" />
            </svg>
            <input type="file" on:change={onFile} accept={allowedExtensions} />
            <Text type="h4">{locale('actions.drag_drop')}</Text>
            <Text classes="mb-12" type="p" secondary>{extentionsLabel}</Text>
            <Button ghost onClick={onFile}>{locale('actions.choose_file')}</Button>
        {/if}
    </content>
</dropzone>
