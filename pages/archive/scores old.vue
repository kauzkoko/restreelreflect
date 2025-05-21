<template>
    <div>
        <h1>Howler</h1>
        <button @click="playByName('1a')">1a</button>
        <button @click="playByName('1b')">1b</button>
        <button @click="playByName('1q')">1q</button>
        <button @click="playByName('2a')">2a</button>
        <button @click="playByName('2b')">2b</button>
        <button @click="playByName('2q')">2q</button>
        <button @click="playByName('3a')">3a</button>
        <button @click="playByName('3b')">3b</button>
        <button @click="playByName('3q')">3q</button>
        <button @click="playByName('4a')">4a</button>
        <button @click="playByName('4b')">4b</button>
        <button @click="playByName('4q')">4q</button>
    </div>
</template>

<script setup>
import { Howl, Howler } from 'howler';

const scores = [
  {
    path: '/sounds/1/1a.mp3',
    name: '1a',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/1/1b.mp3',
    name: '1b',
    type: 'answer',
    addictionScore: 2,
    awarenessScore: 1,
  },
  {
    path: '/sounds/1/1q.mp3',
    name: '1q',
    type: 'question',
    addictionScore: 0,
    awarenessScore: 0,
  },
  {
    path: '/sounds/2/2a.mp3',
    name: '2a',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/2/2b.mp3',
    name: '2b',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/2/2q.mp3',
    name: '2q',
    type: 'question',
    addictionScore: 0,
    awarenessScore: 0,
  },
  {
    path: '/sounds/3/3a.mp3',
    name: '3a',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/3/3b.mp3',
    name: '3b',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/3/3q.mp3',
    name: '3q',
    type: 'question',
    addictionScore: 0,
    awarenessScore: 0,
  },
  {
    path: '/sounds/4/4a.mp3',
    name: '4a',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/4/4b.mp3',
    name: '4b',
    type: 'answer',
    addictionScore: 0,
    awarenessScore: 3,
  },
  {
    path: '/sounds/4/4q.mp3',
    name: '4q',
    type: 'question',
    addictionScore: 0,
    awarenessScore: 0,
  }
]

const sounds = [];
scores.forEach(score => {
    const sound = new Howl({
        src: [score.path],
        html5: true,
        volume: 1,
    });
    sounds.push({
        ...score,
        sound: sound
    })
});

const playByName = (name) => {
    const sound = sounds.find(sound => sound.name === name);
    if (sound.sound.playing()) {
        Howler.stop();
        return;
    }
    Howler.stop();
    sound.sound.play();
}
</script>

<style scoped>
button {
  font-size: 20px;
  margin: 10px;
}
</style>