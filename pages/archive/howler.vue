<template>
    <div>
        <h1>Howler</h1>
        <button @click="play">Play</button>
    </div>
</template>

<script setup>
import { Howl } from 'howler';

const play = () => {
    const sound = new Howl({
        src: ['/sounds/1/1a.mp3']
    });
    sound.play();
}
</script>