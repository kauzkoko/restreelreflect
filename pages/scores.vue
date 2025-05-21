<template>
  <div class="console">
    <div>Current: {{ current }}</div>
    <div>Targeted QR: {{ targetedQR }}</div>
    <div>Current sound: {{ currentSound }}</div>
  </div>
  <div class="container">
    <div class="state" v-if="current === 'start'">
      <div>Welcome to</div>
      <div class="title">Rest, Reel, Reflect</div>
      <div>
        <ol>
          <li>Please enable camera access to continue.</li>
          <li>Put the audio cable on the bed into your phone.</li>
        </ol>
      </div>
    </div>
    <div v-if="current === 'ready'">
      <div>
        Scan QR codes and listen
      </div>
      <div>Answer by scanning [A] or [B] QR codes</div>
    </div>
    <div v-if="current === 'readyForAnswer'">
      Answer by scanning [A] or [B] QR codes
    </div>
    <div v-if="current === 'targeted'">Targeted {{ targetedQR }}</div>
    <div v-if="current === 'charging'">Charging...</div>
    <div v-if="current === 'isPlaying'">Is Playing... <span class="currentSound">{{ currentSound }}</span></div>
    <div v-if="current === 'superSituation'">Super Situation...</div>
    <div v-if="current === 'end'">Restart</div>
    <div class="controls">
      <div>
      <button @click="goTo('ready')">Ready</button>
      <button @click="goTo('readyForAnswer')">Ready for Answer</button>
      <button @click="goTo('targeted')">Targeted</button>
      <button @click="goTo('charging')">Charging</button>
      <button @click="goTo('isPlaying')">Is Playing</button>
      <button @click="goTo('superSituation')">Super Situation</button>
      <button @click="goTo('end')">End</button>
    </div>
    <div>
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
      <button @click="stopPlaying">Stop</button>
    </div>
    </div>

  </div>
</template>

<script setup>
import { Howl, Howler } from 'howler';

const targetedQR = ref("no QR code targeted");
const currentSound = ref("no currentSound");
const lastSound = ref('no lastSound');
const addictionScore = ref(0);
const awarenessScore = ref(0);
const superSituationCounter = ref(0);

const {
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper([
  'start',
  'ready',
  'readyForAnswer',
  'targeted',
  'charging',
  'isPlaying',
  'superSituation',
  'end'
])

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
  const sound = useSound(score.path, {
    volume: 1,
    interrupt: false,
    html5: true
  })
  sounds.push({
    ...score,
    sound: sound
  })
});

const playByName = (name) => {
  lastSound.value = currentSound.name;
  const { sound, name: soundName } = sounds.find(sound => sound.name === name);
  currentSound.value = soundName;
  if (sound.isPlaying.value) {
    currentSound.value = 'no currentSound';
    Howler.stop();
    return;
  }
  Howler.stop();
  sound.play();
}

const stopPlaying = () => {
  Howler.stop();
}
</script>

<style scoped>
.container {
  font-family: 'Inter', sans-serif;
  color: white;
  font-size: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100dvw;
  height: 100dvh;

  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 85%;
  }

  .title {
    /* font-size: 40px; */
    font-weight: bold;
  }

  .currentSound {
    color: red;
  }
}

.console {
  position: absolute;
  top: 0;
  left: 0;
  color: red;
  font-size: 20px;
  font-weight: bold;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    font-size: 14px;
    margin: 4px;
  }
}
</style>