<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
    import { SvelteComponent } from 'svelte'
    import { ParagraphBlock, LinkBlock } from 'shared/components'

    export let text: string

    const renderers: Record<string, typeof SvelteComponent | null> = {
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

<markdown-wrapper>
    <SvelteMarkdown source={text} {renderers} />
</markdown-wrapper>

<style lang="scss">
    markdown-wrapper {
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
