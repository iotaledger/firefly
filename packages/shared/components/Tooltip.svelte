<script lang="typescript">
    import {  Text } from 'shared/components'
    export let text = ''
    export let classes = ''

</script>

<style type="text/scss">
   .leftside{
       width: max-content;
       max-width: 15rem;
       top: 0rem;
       z-index: 10;
   }
   .above{
       width: max-content;
       top:-3rem;
       right: -4.5rem;
       z-index: 10;
   }
</style>

<div class="py-4 px-6 shadow-lg rounded-xl bg-white cursor-pointer absolute text-center {classes}">
    <Text>{text}</Text>
</div>
