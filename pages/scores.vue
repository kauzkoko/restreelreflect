<template>
    <div>
        <h1>Howler</h1>
        <button @click="playByName('1q')">Play</button>
    </div>
</template>

<script setup>
import { Howl } from 'howler';

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
        src: [score.path]
    });
    sounds.push({
        ...score,
        sound: sound
    })
});

const playByName = (name) => {
    const sound = sounds.find(sound => sound.name === name);
    sound.sound.play();
}
</script>