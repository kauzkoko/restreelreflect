<template>
  <div class="container">
    <!-- <div ref="console" class="console">
      {{ isPlaying }}
    </div> -->
    <video class="video" ref="videoRef" />
    <div class="videoOverlay"></div>
    <div class="blendOverlay"></div>
    <div class="overlay">
      <svg class="customOverlay" ref="customOverlayRef" v-if="isScanning"
        :class="isSuperSituation ? 'superSituation' : isPlaying ? 'isPlaying' : ''" viewBox="0 0 100 100"
        preserveAspectRatio="true">
        <rect id="square" x="10" y="10" width="80" height="80" rx="2" ry="2" fill="none" stroke-width="4"
          stroke-dasharray="40, 40" :stroke-dashoffset="offset" />
      </svg>
    </div>
    <div class="state" v-if="current === 'start'">
      <div class="title">
        <div>Welcome to</div>
        <div class="rrr">Rest, Reel, Reflect</div>
      </div>
      <div>
        <ol>
          <li>Put the audio cable on the bed into your phone.</li><br>
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
      <div>Answer by scanning <br>[A] or [B] QR codes.</div>
    </div>
    <div v-if="current === 'readyForAnswer'">
      Answer by scanning [A] or [B] QR codes
    </div>
    <!-- <div v-if="current === 'superSituation'">Super Situation...
      <div>Total addiction score: {{ totalAddictionScore }}</div>
      <div>Total awareness score: {{ totalAwarenessScore }}</div>
      <div>YOU ARE COMPLETELY FUCKED UP</div>
      <div class="startButton" @click="goTo('start')">
        <div>OK</div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Howler } from 'howler';
import { animate } from 'animejs';

let qrScanner;

const offset = ref(23.5);
const videoRef = templateRef('videoRef');
const targetedQR = ref("no QR code targeted");
const currentSound = ref("no currentSound");
const totalAddictionScore = ref(0);
const totalAwarenessScore = ref(0);
const superSituationCounter = ref(0);
const isScanning = ref(false);
const id = ref(0);
const previousId = ref(0)
const order = ref([])
const orderIds = ref([])
const uniqueValues = ref(0)
const previousQuestionName = ref(null)
const isPlaying = ref(false);
const uniqueValuesReached = ref(false);
const isSuperSituation = ref(false);
const previousAnswerToQuestionName = ref(null);

let superSituationThreshold = 3;
const lastPlayedTimes = new Map();


const {
  current,
  goTo,
} = useStepper([
  'start',
  'ready',
  'readyForAnswer',
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
  interrupt: false,
  html5: true,
})

const resetFromSuperSituation = () => {
  isSuperSituation.value = false;
  superSituationCounter.value = 0;
  totalAddictionScore.value = 0;
  totalAwarenessScore.value = 0;
  order.value = [];
  orderIds.value = [];
  uniqueValues.value = 0;
  previousQuestionName.value = null;
  previousId.value = 0;
  isPlaying.value = false;
  uniqueValuesReached.value = false;
  previousAnswerToQuestionName.value = null;
  previousAnswerToQuestionName.value = null;
  lastPlayedTimes.clear();
  stopAnimation();

  // sounds.forEach(sound => {
  //   if (sound.answer) {
  //     delete sound.answer;
  //   }
  // });

  goTo('ready');
}

const { play: playShitholeSound } = useSound('/sounds/shithole.mp3', {
  volume: 1,
  interrupt: false,
  html5: true,
  onplay: () => {
    isPlaying.value = true;
  },
  onend: () => {
    resetFromSuperSituation();
  }
})

const { play: playCowSound } = useSound('/sounds/cow.mp3', {
  volume: 1,
  interrupt: false,
  html5: true,
  onplay: () => {
    isPlaying.value = true;
  },
  onend: () => {
    resetFromSuperSituation();
  }
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
      if (question.name === previousAnswerToQuestionName.value) {
        previousAnswerToQuestionName.value = null;
      }
    }
  })
  sounds.push({
    ...question,
    sound: sound
  })
  console.log('sounds', sounds);
});

const setAnswerToQuestion = (questionId, answer, answerId) => {
  const question = getSoundById(questionId);

  if (previousAnswerToQuestionName.value === question.name) {
    return;
  }

  playConfirmation(answerId.value);

  if (question.answer) {
    totalAddictionScore.value -= question.answer === 'A' ? question.addictionScoreA : question.addictionScoreB;
    totalAwarenessScore.value -= question.answer === 'A' ? question.awarenessScoreA : question.awarenessScoreB;
  }

  question.answer = answer;
  totalAddictionScore.value += answer === 'A' ? question.addictionScoreA : question.addictionScoreB;
  totalAwarenessScore.value += answer === 'A' ? question.awarenessScoreA : question.awarenessScoreB;

  previousAnswerToQuestionName.value = question.name;

  if (uniqueValuesReached.value) {
    console.log('uniqueValuesReached and answers set');
    Howler.stop();
    isSuperSituation.value = true;
    setTimeout(() => {
      if (totalAddictionScore.value > totalAwarenessScore.value) {
        playShitholeSound();
      } else {
        playCowSound();
      }
    }, 1500);
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
  if (qrScanner) {
    qrScanner.start();
    isScanning.value = true;
  }
}

const stopScanning = () => {
  isScanning.value = false;
  qrScanner.stop();
}

const playConfirmation = (id) => {
  Howler.stop();
  playConfirmationSound();
  lastPlayedTimes.set(id, Date.now());
}

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

  if (!isPlaying.value) {
    if (isAnswerA) {
      const now = Date.now();
      const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
      if (now - lastPlayedTimestamp > 3000) {
        setAnswerToQuestion(orderIds.value[orderIds.value.length - 1], 'A', id)
      }
    }

    if (isAnswerB) {
      const now = Date.now();
      const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
      if (now - lastPlayedTimestamp > 3000) {
        setAnswerToQuestion(orderIds.value[orderIds.value.length - 1], 'B', id)
      }
    }

    if (isQuestion) {
      const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
      const now = Date.now();
      console.log('now in isQuestion', now);
      if (now - lastPlayedTimestamp > 3000) {
        playById(id.value);
        lastPlayedTimes.set(id.value, now);
      }
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

// onUnmounted(() => {
//   stopScanning();
//   qrScanner.destroy();
// })
</script>

<style scoped>
.container {
  font-family: 'Inter', sans-serif;
  color: white;
  font-size: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .customOverlay {
    background: transparent;
    pointer-events: none;
    stroke: #647E99;
    opacity: 0.8;
    transition: stroke 0.5s linear;

    @media screen and (orientation: landscape) {
      top: 50dvw;
      left: 50dvh;
      width: 100dvh;
      height: 100dvw;
    }
  }

  .isPlaying {
    stroke: #3481CF;
    opacity: 1;
  }

  .superSituation {
    stroke: #FFCF6B;
    opacity: 0.8;
  }

  .video {
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    z-index: -1;
    opacity: 0.5;
    object-fit: cover;
  }

  .videoOverlay {
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    background-color: black;
    z-index: -1;
    opacity: 0.3;
  }

  .blendOverlay {
    position: fixed;
    width: 93dvw;
    height: 93dvw;
    aspect-ratio: 1/1;
    background-color: white;
    mix-blend-mode: overlay;
    z-index: -1;

    @media screen and (orientation: landscape) {
      width: 93dvh;
      height: 93dvh;
    }
  }

  .startButton {
    margin-top: 28px;
    background-color: white;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    /* text-transform: uppercase; */
    padding: 20px 20px;
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
    z-index: 9999999999999;

    li {
      text-align: left;
    }

    .readyText {
      margin-bottom: 20px;
    }

    .title {
      margin-bottom: 40px;
    }
  }



  .rrr {
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