<script lang="typescript">
    export let video
    export let width = '100%'
    export let height = '100%'
    export let sandbox = '' // Applies all restrictions
    export let allowfullscreen = true
    export let scrolling = 'no'
</script>

<div class="relative w-full h-auto overflow-hidden rounded-2xl">
    <iframe
        srcdoc={`
            <head>
                <style type="text/css" ✂prettier:content✂="CiAgICAgICAgICAgICAgICAgICAgYm9keSB7CiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMHB4OwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICB2aWRlbzpmb2N1cyB7CiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAg" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂=""></style>
            </head>
            <video 
                width="100%" 
                height="auto"
                controls
                controlsList="nodownload"
                disablePictureInPicture>
                    <source src="${video}" type="video/mp4" />
            </video>
        `}
        {width}
        {height}
        {allowfullscreen}
        {scrolling}
        {sandbox}
        frameborder="0"
        title="video" />
</div>

<style type="text/css">
    div {
        padding-top: 56.25%;
    }
    iframe {
        @apply h-full;
        @apply w-full;
        @apply absolute;
        @apply left-0;
        @apply top-0;
    }
</style>
