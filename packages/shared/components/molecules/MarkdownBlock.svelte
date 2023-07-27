<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
    import { ParagraphBlock, LinkBlock } from 'shared/components'
    export let text: string

    const renderers = {
        heading: ParagraphBlock,
        paragraph: ParagraphBlock,
        image: ParagraphBlock,
        link: LinkBlock,
        em: ParagraphBlock,
        strong: ParagraphBlock,
        codespan: ParagraphBlock,
        del: ParagraphBlock,
        table: ParagraphBlock,
        tablehead: ParagraphBlock,
        tablebody: ParagraphBlock,
        tablerow: ParagraphBlock,
        tablecell: ParagraphBlock,
        list: ParagraphBlock,
        orderedlistitem: null,
        unorderedlistitem: null,
        listitem: ParagraphBlock,
        hr: ParagraphBlock,
        html: null,
        blockquote: ParagraphBlock,
        code: ParagraphBlock,
    }
</script>

<div class="markdown">
    <SvelteMarkdown source={text} {renderers} />
</div>

<style lang="scss">
    .markdown {
        :global(p) {
            @apply text-gray-600;
        }
        :global(p),
        :global(p a) {
            @apply leading-140;
            @apply font-500;
            @apply text-14;
        }
    }
</style>
