<template>
    <div id="chat-group">
        <a href="#" v-on:click.prevent="$emit('click-group', name)"><strong>{{ name }}</strong></a>
    </div>
</template>

<script>
    export default {
        name: "ChatGroup",
        props: [ 'name' ]
    }
</script>

<style scoped>

</style>