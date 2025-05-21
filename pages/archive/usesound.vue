<template>
    <div>
        <button @click="play">Play</button>
    </div>      
</template>

<script setup>
const { play } = useSound('/sounds/1/1a.mp3', {
    volume: 1,
    interrupt: false,
    html5: true
})
</script>