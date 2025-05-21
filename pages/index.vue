<template>

  <div class="console">
    <div class="checkboxes">
      <div>
        <input type="checkbox" id="refs" v-model="showRefs">
        <label for="refs">Refs</label>
      </div>
      <div>
        <input type="checkbox" id="controls" v-model="showControls">
        <label for="controls">Show Controls</label>
      </div>
    </div>
    <div v-if="showRefs">
      <div>Current: {{ current }}</div>
      <div>Targeted QR: {{ targetedQR }}</div>
      <div>Current sound: {{ currentSound }}</div>
      <div>Previous sound: {{ previousSound }}</div>
      <div>Addiction score: {{ addictionScore }}</div>
      <div>Awareness score: {{ awarenessScore }}</div>
      <div>Super situation counter: {{ superSituationCounter }}</div>
      <div>Is scanning: {{ isScanning }}</div>
      <div>Id: {{ id }}</div>
      <div>Previous id: {{ previousId }}</div>
    </div>
  </div>
  <div class="container">
    <video class="video" ref="videoRef" />
    <svg class="customOverlay" ref="customOverlayRef" v-if="isScanning"
      :class="current === 'targeted' ? 'targeted' : current === 'charging' ? 'charging' : current === 'isPlaying' ? 'isPlaying' : ''"
      viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect id="square" x="10" y="10" width="80" height="80" rx="2" ry="2" fill="none" stroke-width="4"
        stroke-dasharray="40, 40" :stroke-dashoffset="offset" />
    </svg>
    <div class="state" v-if="current === 'start'">
      <div>Welcome to</div>
      <div class="title">Rest, Reel, Reflect</div>
      <div>
        <ol>
          <li>Put the audio cable on the bed into your phone.</li>
          <li>Click start and enable camera access when asked.</li>
        </ol>
      </div>
      <div>
        <div class="startButton" @click="start()">
          <div>Start</div>
        </div>
      </div>
    </div>
    <div class="state" v-if="current === 'ready'">
      <div class="readyText">
        Scan QR codes and listen.
      </div>
      <div>Answer by scanning [A] or [B] QR codes.</div>
    </div>
    <div v-if="current === 'readyForAnswer'">
      Answer by scanning [A] or [B] QR codes
    </div>
    <div v-if="current === 'targeted'">Targeted {{ targetedQR }}</div>
    <div v-if="current === 'charging'">Charging...</div>
    <div v-if="current === 'isPlaying'">Is Playing... <span class="currentSound">{{ currentSound }}</span></div>
    <div v-if="current === 'superSituation'">Super Situation...</div>
    <div v-if="current === 'end'">Restart</div>
    <div class="controls" v-if="showControls">
      <div>
        <button @click="goTo('start')">Start</button>
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
        <button @click="stopPlaying">Stop playing</button>
        <button @click="qrScanner.stop()">Stop scanning</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Howler } from 'howler';
import { animate } from 'animejs';

let qrScanner;

const map = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const { x, y } = useMouse();
// watch(x, () => {
//   offset.value = map(x.value, 0, window.innerWidth, 0, 30);
//   console.log(offset.value);
// })
const showControls = ref(false);
const showRefs = ref(false);
const offset = ref(23.5);
const videoRef = templateRef('videoRef');
const targetedQR = ref("no QR code targeted");
const currentSound = ref("no currentSound");
const previousSound = ref('no previousSound');
const addictionScore = ref(0);
const awarenessScore = ref(0);
const superSituationCounter = ref(0);
const isScanning = ref(false);
const id = ref(0);
const previousId = ref(0);
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


let animation;
const startAnimation = () => {
  console.log('startAnimation');
  const square = document.querySelector('#square');
  animation = animate(square, { strokeDashoffset: 1000, duration: 25000, loop: true, ease: 'easeInOutSine', autoplay: true });
}

const stopAnimation = () => {
  console.log('stopAnimation');
  animate(square, {
    strokeDashoffset: 23.5, duration: 500, loop: false, ease: 'linear', autoplay: true, onComplete: () => {
      animation.revert();
    }
  });
}


watch(current, () => {
  console.log('current', current.value);
  if (current.value === 'isPlaying') {
    startAnimation();
  } else {
    if (animation) stopAnimation();
    offset.value = 23.5;
  }

  if (current.value === 'start') {
    if (animation) stopAnimation();
    stopScanning();
    offset.value = 23.5;
  }
})

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
  previousSound.value = currentSound.value;
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

const playById = (id) => {
  const { sound, name: soundName } = sounds.find(sound => sound.id === id);
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

const start = () => {
  goTo('ready');
  console.log('start');
  qrScanner.start();
  isScanning.value = true;
}

const stopScanning = () => {
  isScanning.value = false;
  qrScanner.stop();
}

let newIdTimestamp = 0;
let sameIdCounter = ref(0);
onMounted(() => {
  qrScanner = new QrScanner(
    videoRef.value,
    (data) => {
      previousId.value = id.value;
      id.value = data.data.split('?id=')[1];
      console.log("just scanned id", id.value);
      if (previousId.value === id.value) {
        sameIdCounter.value++;
      } else {
        sameIdCounter.value = 0;
        newIdTimestamp = Date.now();
      }

      if (previousId.value === id.value && sameIdCounter.value > 30 && Date.now() - newIdTimestamp > 1000) {
        console.log("same id play", sameIdCounter.value);
        playByName('1a');
        sameIdCounter.value = 0;
        newIdTimestamp = 0
      }
    },
    { returnDetailedScanResult: true }
  );
  start();
});

onUnmounted(() => {
  stopScanning();
  qrScanner.destroy();
})
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
  overflow: hidden;

  .customOverlay {
    position: fixed;
    top: 50dvh;
    left: 50dvw;
    width: 100dvw;
    height: 100dwh;
    transform: translate(-50%, -50%);
    background: transparent;
    pointer-events: none;
    stroke: #647E99;
    opacity: 0.8;
    transition: stroke 0.5s linear;
  }

  .targeted {
    stroke: #5D7185;
  }

  .charging {
    stroke: #36699C;
  }

  .active {
    stroke: #3481CF;
  }

  .isPlaying {
    stroke: #3481CF;
  }

  .video {
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    z-index: -1;
    opacity: 0.5;
    object-fit: cover;
  }

  .startButton {
    background-color: white;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    /* text-transform: uppercase; */
    padding: 10px 10px;
    border-radius: 5px;
    cursor: pointer;

    div {
      padding-top: 4px;
    }
  }

  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 85%;
    text-align: center;

    li {
      text-align: left;
    }

    .readyText {
      margin-bottom: 20px;
    }
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

<!-- <style>
.scan-region-highlight {
  display: flex;
  align-items: center;
  justify-content: center;

  .scan-region-highlight-svg {
    stroke: blue !important;
    padding: 10px;
  }
}
</style> -->