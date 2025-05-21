<template>
    <div>
        <h1>Howler</h1>
        <button @click="play">Play</button>
    </div>
</template>

<script setup>
import { Howl } from 'howler';

const sound = new Howl({
        src: ['/sounds/1a.mp3'],
        html5: true,
        volume: 1
    });

const play = () => {
    console.log('play');
    sound.play();
}
</script>