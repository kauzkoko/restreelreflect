<template>
  <div class="container">
    <video class="video" ref="videoRef" />
    <svg class="customOverlay" ref="customOverlayRef" v-if="isScanning" :class="isPlaying ? 'isPlaying' : ''"
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
    <div v-if="current === 'superSituation'">Super Situation...
      <div>Total addiction score: {{ totalAddictionScore }}</div>
      <div>Total awareness score: {{ totalAwarenessScore }}</div>
      <div>YOU ARE COMPLETELY FUCKED UP</div>
      <div class="startButton" @click="goTo('start')">
        <div>OK</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Howler } from 'howler';
import { animate } from 'animejs';

let qrScanner;
let newIdTimestamp = 0;


const showControls = ref(false);
const showRefs = ref(true);
const offset = ref(23.5);
const videoRef = templateRef('videoRef');
const targetedQR = ref("no QR code targeted");
const currentSound = ref("no currentSound");
const previousSound = ref('no previousSound');
const totalAddictionScore = ref(0);
const totalAwarenessScore = ref(0);
const superSituationCounter = ref(0);
const isScanning = ref(false);
const id = ref(0);
const previousId = ref(0)
const sameIdCounter = ref(0)
const order = ref([])
const orderIds = ref([])
const uniqueValues = ref(0)
const previousQuestionName = ref(null)
const shouldTrigger = ref(false)
let previousQuestion = ref(null)
const isPlaying = ref(false);
const uniqueValuesReached = ref(false);

let superSituationThreshold = 2;

const {
  current,
  goTo,
} = useStepper([
  'start',
  'ready',
  'superSituation',
  'end'
])

let animation;
const startAnimation = () => {
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

watch(isPlaying, () => {
  console.log('isPlaying', isPlaying.value);
  if (isPlaying.value) {
    startAnimation();
  } else {
    stopAnimation();
  }
})

watch(current, () => {
  if (current.value === 'superSituation') {
    stopScanning();
    if (totalAddictionScore.value > totalAwarenessScore.value) {
      playShitholeSound();
    } else {
      playCowSound();
    }
  }

  if (current.value === 'start') {
    superSituationCounter.value = 0
    totalAddictionScore.value = 0;
    totalAwarenessScore.value = 0;
    order.value = [];
    orderIds.value = [];
    uniqueValues.value = 0;
    previousQuestionName.value = null;
    previousId.value = 0;
  }
})

watch(order, () => {
  uniqueValues.value = new Set(order.value).size;
  if (uniqueValues.value > superSituationThreshold) {
    uniqueValuesReached.value = true;
  } else {
    uniqueValuesReached.value = false;
  }
}, { deep: true })

const { play: playConfirmationSound, isPlaying: isConfirmationSoundPlaying } = useSound('/sounds/confirmation.mp3', {
  volume: 1,
  interrupt: true,
  html5: true
})

const { play: playShitholeSound } = useSound('/sounds/shithole.mp3', {
  volume: 1,
  interrupt: true,
  html5: true
})

const { play: playCowSound } = useSound('/sounds/cow.mp3', {
  volume: 1,
  interrupt: true,
  html5: true
})


const sounds = [];
questions.forEach(question => {
  console.log('question path', question.path);
  const sound = useSound(question.path, {
    volume: 1,
    interrupt: false,
    html5: true,
    onplay: () => {
      isPlaying.value = true;
    },
    onend: () => {
      isPlaying.value = false;
    }
  })
  sounds.push({
    ...question,
    sound: sound
  })
  console.log('sounds', sounds);
});

const setAnswerToQuestion = (id, answer) => {
  const question = getSoundById(id);

  if (question.answer) {
    totalAddictionScore.value -= question.answer === 'A' ? question.addictionScoreA : question.addictionScoreB;
    totalAwarenessScore.value -= question.answer === 'A' ? question.awarenessScoreA : question.awarenessScoreB;
  }

  question.answer = answer;
  totalAddictionScore.value += answer === 'A' ? question.addictionScoreA : question.addictionScoreB;
  totalAwarenessScore.value += answer === 'A' ? question.awarenessScoreA : question.awarenessScoreB;

  if (uniqueValuesReached.value) {
    console.log('uniqueValuesReached and answers set');
    goTo('superSituation');
  }
}

const getSoundById = (id) => {
  return sounds.find(sound => sound.id == id);
}

const playById = (id) => {
  console.log('playing question', id);
  const { sound, name: soundName, type } = getSoundById(id);
  Howler.stop();
  currentSound.value = soundName;
  order.value.push(soundName);
  orderIds.value.push(id);
  sound.play();
}

const start = () => {
  goTo('ready');
  qrScanner.start();
  isScanning.value = true;
}

const stopScanning = () => {
  isScanning.value = false;
  qrScanner.stop();
}

const lastPlayedTimes = new Map();
const scanCallback = (data) => {
  previousId.value = id.value;
  id.value = data.data.split('/')[1];
  targetedQR.value = data.data;

  let isQuestion = false
  let isAnswerA = false
  let isAnswerB = false
  if (id.value % 3 === 0) isQuestion = true;
  else if (id.value % 3 === 1) isAnswerA = true;
  else if (id.value % 3 === 2) isAnswerB = true;
  // else if (id.value > 39 && id.value < 70) isAnswerA = true;
  // else if (id.value > 69 && id.value < 100) isAnswerB = true;
  // if (id.value > 0 && id.value < 20) isQuestion = true;

  if (isAnswerA) {
    const now = Date.now();
    const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
    if (now - lastPlayedTimestamp > 3000) { // 3 seconds cooldown
      playConfirmationSound();
      lastPlayedTimes.set(id.value, now);
      console.log('answer A');
      setAnswerToQuestion(orderIds.value[orderIds.value.length - 1], 'A')
    }
  }

  if (isAnswerB) {
    const now = Date.now();
    const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
    if (now - lastPlayedTimestamp > 3000) { // 3 seconds cooldown
      playConfirmationSound();
      lastPlayedTimes.set(id.value, now);
      console.log('answer B');
      setAnswerToQuestion(orderIds.value[orderIds.value.length - 1], 'B')
    }
  }

  if (isQuestion && !isPlaying.value) {
    const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
    const now = Date.now();
    if (now - lastPlayedTimestamp > 3000) { // 3 seconds cooldown
      playById(id.value);
      lastPlayedTimes.set(id.value, now);
    }
  }
}

onMounted(() => {
  qrScanner = new QrScanner(
    videoRef.value,
    scanCallback,
    { returnDetailedScanResult: true }
  );
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

.showRefs {
  background-color: rgba(0, 0, 0, 0.8);
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