<script lang="typescript">
    import {  Text } from 'shared/components'
    export let text = ''
</script>

<style type="text/scss">
   .tooltip{
       top:-4rem;
       right: -4.5rem;
       width: max-content;
   }
</style>

<div class="tooltip py-4 px-6 shadow-lg rounded-xl bg-white cursor-pointer absolute">
    <Text>{text}</Text>
</div>
