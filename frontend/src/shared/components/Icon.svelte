<script>
    export let icon
    export let width
    export let height
    export let classes

    $: selected = icons[icon]

    const icons = {
        parchment: {
            width: 24,
            height: 24,
            path:
                'm 9,11 h 5 v 2 H 9 Z M 9,7 h 7 V 9 H 9 Z M 6,7 H 4 C 2.89543,7 2,6.10457 2,5 2,3.89543 2.89543,3 4,3 h 2 z m 4,10 h 9.5 c 1.1046,0 2,0.8954 2,2 0,1.1046 -0.8954,2 -2,2 H 10.618 L 10.354,20.472 C 10.7512,20.1065 11,19.5823 11,19 11,18.2597 10.5978,17.6134 10,17.2676 Z m 9.0001,0 V 7 c 0,-2.20914 -1.7909,-4 -4,-4 H 6 l 5e-5,4 v 10 c 0,2.2091 1.79086,4 4.00005,4 h 2.4375',
        },
        doc: {
            width: 24,
            height: 24,
            path:
                'M15 12C15 13.1046 14.1046 14 13 14H11V16C11 17.1046 10.1046 18 9 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V12ZM17 12C17 14.2091 15.2091 16 13 16C13 18.2091 11.2091 20 9 20H4C1.79086 20 0 18.2091 0 16V4C0 1.79086 1.79086 0 4 0H13C15.2091 0 17 1.79086 17 4V12ZM5 7H12V5H5V7ZM5 11H10.32V9H5V11Z',
        },
        'arrow-right': {
            width: 24,
            height: 24,
            path: 'M9.00012 5L15.4604 12L9.00012 19',
        },
    }
</script>

{#if selected}
    <svg
        class={classes}
        width={width || selected.width || '100%'}
        height={height || selected.height || '100%'}
        viewBox="0 0 {width || selected.width}
        {height || selected.height}"
        xmlns="http://www.w3.org/2000/svg">
        <path d={selected.path} />
    </svg>
{/if}
