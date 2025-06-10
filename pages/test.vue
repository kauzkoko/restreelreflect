<template>
  <div class="container">
    <!-- <video class="video" ref="videoRef" /> -->
    <div id="reader"></div>
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
      <div>Answer by scanning <br><span class="answerA">[A]</span> or <span class="answerB">[B]</span> QR codes.</div>
    </div>
    <div v-if="current === 'readyForAnswer'">
      Answer by scanning [A] or [B] QR codes
    </div>
  </div>
  <div class="debug">
    <div>{{ id }}</div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Html5QrcodeScanner } from 'html5-qrcode';

import { Howler } from 'howler';
import { animate } from 'animejs';

let qrScanner;

const offset = ref(23.5);
const videoRef = templateRef('videoRef');
const totalXScore = ref(0);
const totalYScore = ref(0);
const superSituationCounter = ref(0);
const isScanning = ref(false);
const id = ref(0);
const previousId = ref(0)
const order = ref([])
const orderIds = ref([])
const uniqueValues = ref(0)
const previousQuestionName = ref("");
const previousAnswerToQuestionName = ref("");

const isPlaying = ref(false);
const uniqueValuesReached = ref(false);
const isSuperSituation = ref(false);
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
  totalXScore.value = 0;
  totalYScore.value = 0;
  order.value = [];
  orderIds.value = [];
  uniqueValues.value = 0;
  previousQuestionName.value = null;
  previousId.value = 0;
  isPlaying.value = false;
  uniqueValuesReached.value = false;
  previousAnswerToQuestionName.value = "";
  previousAnswerToQuestionName.value = "";
  lastPlayedTimes.clear();
  stopAnimation();
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
      if (question.name && question.name === previousAnswerToQuestionName.value) {
        previousAnswerToQuestionName.value = "";
      }
    }
  })
  sounds.push({
    ...question,
    sound: sound
  })
});


const superSituation00 = useSound('/sounds/ss_00.mp3', {
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

const superSituation01 = useSound('/sounds/ss_01.mp3', {
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

const superSituation02 = useSound('/sounds/ss_02.mp3', {
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

const superSituation03 = useSound('/sounds/ss_03.mp3', {
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

const superSituation04 = useSound('/sounds/ss_04.mp3', {
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

const superSituation10 = useSound('/sounds/ss_10.mp3', {
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

const superSituation11 = useSound('/sounds/ss_11.mp3', {
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

const superSituation12 = useSound('/sounds/ss_12.mp3', {
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

const superSituation13 = useSound('/sounds/ss_13.mp3', {
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

const superSituation20 = useSound('/sounds/ss_20.mp3', {
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

const superSituation21 = useSound('/sounds/ss_21.mp3', {
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

const superSituation22 = useSound('/sounds/ss_22.mp3', {
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

const superSituation30 = useSound('/sounds/ss_30.mp3', {
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

const superSituation31 = useSound('/sounds/ss_31.mp3', {
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

const superSituation40 = useSound('/sounds/ss_40.mp3', {
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

const setAnswerToQuestion = (questionId, answer, answerId) => {
  const question = getSoundById(questionId);

  if (question.name && previousAnswerToQuestionName.value === question.name) {
    return;
  }

  playConfirmation(answerId.value);



  if (question.answer) {
    totalXScore.value -= question.answer === 'A' ? question.xA : question.xB;
    totalYScore.value -= question.answer === 'A' ? question.yA : question.yB;
  }

  question.answer = answer;
  totalXScore.value += answer === 'A' ? question.xA : question.xB;
  totalYScore.value += answer === 'A' ? question.yA : question.yB;

  if (question.name) {
    previousAnswerToQuestionName.value = question.name;
  }

  let superSituationTimeout = 3000;
  if (uniqueValuesReached.value) {
    console.log('uniqueValuesReached and answers set');
    Howler.stop();
    isSuperSituation.value = true;
    setTimeout(() => {
      if (totalXScore.value === 0 && totalYScore.value === 0) {
        setTimeout(() => {
          superSituation00.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 0 && totalYScore.value === 1) {
        setTimeout(() => {
          superSituation01.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 0 && totalYScore.value === 2) {
        setTimeout(() => {
          superSituation02.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 0 && totalYScore.value === 3) {
        setTimeout(() => {
          superSituation03.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 0 && totalYScore.value === 4) {
        setTimeout(() => {
          superSituation04.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 1 && totalYScore.value === 0) {
        setTimeout(() => {
          superSituation10.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 1 && totalYScore.value === 1) {
        setTimeout(() => {
          superSituation11.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 1 && totalYScore.value === 2) {
        setTimeout(() => {
          superSituation12.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 1 && totalYScore.value === 3) {
        setTimeout(() => {
          superSituation13.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 2 && totalYScore.value === 0) {
        setTimeout(() => {
          superSituation20.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 2 && totalYScore.value === 1) {
        setTimeout(() => {
          superSituation21.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 2 && totalYScore.value === 2) {
        setTimeout(() => {
          superSituation22.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 3 && totalYScore.value === 0) {
        setTimeout(() => {
          superSituation30.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 3 && totalYScore.value === 1) {
        setTimeout(() => {
          superSituation31.play();
        }, superSituationTimeout);
      } else if (totalXScore.value === 4 && totalYScore.value === 0) {
        setTimeout(() => {
          superSituation40.play();
        }, superSituationTimeout);
      } else resetFromSuperSituation();
    });
  };
}

const getSoundById = (id) => {
  return sounds.find(sound => sound.id == id);
}

const playById = (id) => {
  console.log('playing question', id);
  const { sound, name: soundName, type } = getSoundById(id);
  Howler.stop();
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

// function scanCallback(decodedText, decodedResult) {
//     // Handle on success condition with the decoded text or result.
//     console.log(`Scan result: ${decodedText}`, decodedResult);
//     id.value = decodedText;
// }

const scanCallback = (decodedText, decodedResult) => {
  previousId.value = id.value;

  id.value = decodedText.split('/')[1];
  // id.value = data.data.split('/')[1];
  console.log('id', id.value);

  let isQuestion = false
  let isAnswerA = false
  let isAnswerB = false

  if (id.value.startsWith('0')) {
    id.value = id.value.slice(1);
  }
  console.log('id', id.value);

  if (id.value > 0 && id.value < 21) isQuestion = true;
  else if (id.value == 40) isAnswerA = true;
  else if (id.value == 70) isAnswerB = true;

  if (!isPlaying.value) {
    if (isAnswerA) {
      logActivity();
      console.log('isAnswerA', isAnswerA);
      const now = Date.now();
      const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
      if (now - lastPlayedTimestamp > 3000) {
        setAnswerToQuestion(orderIds.value[orderIds.value.length - 1], 'A', id)
      }
    }

    if (isAnswerB) {
      logActivity();
      const now = Date.now();
      const lastPlayedTimestamp = lastPlayedTimes.get(id.value) || 0;
      if (now - lastPlayedTimestamp > 3000) {
        setAnswerToQuestion(orderIds.value[orderIds.value.length - 1], 'B', id)
      }
    }

    if (isQuestion) {
      logActivity();
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
let inactivityTimer = null;
let inactivityTimeInSeconds = 90
const handleInactivity = () => {
  console.log('handleInactivity');
};

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  inactivityTimer = setTimeout(handleInactivity, inactivityTimeInSeconds * 1000); // 60 seconds
};

const logActivity = () => {
  resetInactivityTimer();
};

onMounted(() => {
  window.addEventListener('contextmenu', e => e.preventDefault());

  resetInactivityTimer();
});

onMounted(() => {
  // qrScanner = new QrScanner(
  //   videoRef.value,
  //   scanCallback,
  //   { returnDetailedScanResult: true, maxScansPerSecond: 5 }
  // );

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  var qrScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 200, rememberLastUsedCamera: false });
  qrScanner.render(scanCallback);
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
    font-weight: bold;
  }

  .answerA {
    color: #F3CFC5;
    font-weight: bold;
  }

  .answerB {
    color: #C4EAFF;
    font-weight: bold;
  }
}

.debug {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: red;
  color: blue;
  z-index: 9999999999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* .html5-qrcode-element {
    display: none !important;
} */

/* #reader__dashboard_section {
    display: none !important;
} */
</style>