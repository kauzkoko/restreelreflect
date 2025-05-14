<template>
    <audio v-for="sound in sounds" ref="audioElem" :src="sound.path" no-controls />
    <button @click="start">Start</button>
</template>

<script setup>
const sounds = [
    {
        path: '/sounds/1.mp3',
        name: 'Spinnentanz',
        beschreibung: 'Eine Geschichte von 7 Spinnen, die einen Tanz tanzen und singen.'
    },
    {
        path: '/sounds/2.mp3',
        name: 'Perlenschatz',
        beschreibung: 'Eine Geschichte von einem Perlenkönig, der seinen Schatz sucht.'
    }
]

const audioElem = ref();
const started = ref(false);

const start = () => {
    started.value = true;
}

whenever(started, () => {
    audioElem.value.forEach(audio => {
        audio.play();
    })
})
</script>