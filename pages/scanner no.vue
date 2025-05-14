<template>
  <div class="outer">
    <video class="video" ref="videoElem" />
    <div v-if="finalFrame" class="controls">DU BISCH... </div>
    <div v-if="!scanning && finalFrame" class="controls" @click="startReading()">NEUSTART</div>
    <div v-if="!scanning && !finalFrame" class="controls" @click="startReading()">START</div>
    <div v-if="scanning && !finalFrame" class="controls" @click="stopReading()">
      <span class="stop">STOP</span><br />
    </div>
    <div v-if="answer !== 'no answer yet'">
      <div class="answer">{{ answer }}</div>
    </div>
    <audio class="audio" autoplay muted ref="audio" />
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
const { chat } = useChatgpt()


const finalFrame = ref(false);
const videoElem = ref();
const scanning = ref(false);
let id = ""
let lastId = ""
let throttledCounter = 0;
let answer = ref('no answer yet')
let qrScanner;

let soundPaths = [];
soundPaths.push('/sounds/1.mp3');
soundPaths.push('/sounds/2.mp3');
soundPaths.push('/sounds/3.mp3');
soundPaths.push('/sounds/4.mp3');
soundPaths.push('/sounds/5.mp3');
soundPaths.push('/sounds/6.mp3');
soundPaths.push('/sounds/7.mp3');
soundPaths.push('/sounds/8.mp3');
soundPaths.push('/sounds/final.mp3');
const audio = ref(null);

const stopSounds = () => {
  audio.value.pause();
  audio.value.currentTime = 0;
  audio.value.volume = 1
}

const playThrottled = useThrottleFn(async (id) => {
  stopSounds();
  console.log("playThrottled id", id);
  console.log("playThrottled throttledCounter", throttledCounter);

  if (throttledCounter > 2) {
    console.log("playThrottled stop");

    qrScanner.stop();
    scanning.value = false;
    finalFrame.value = true;

    audio.value.src = soundPaths[8];
    audio.value.play();
  } else if (throttledCounter > 1) {
    answer.value = "Ich bin ein Roboter"
    // answer.value = await chat(inputData.value)
  }

  else if (id === "1") {
    audio.value.src = soundPaths[0];
    audio.value.play();
  } else if (id === "2") {
    audio.value.src = soundPaths[1];
    audio.value.play();
  } else if (id === "3") {
    audio.value.src = soundPaths[2];
    audio.value.play();
  } else if (id === "4") {
    audio.value.src = soundPaths[3];
    audio.value.play();
  } else if (id === "5") {
    audio.value.src = soundPaths[4];
    audio.value.play();
  } else if (id === "6") {
    audio.value.src = soundPaths[5];
    audio.value.play();
  } else if (id === "7") {
    audio.value.src = soundPaths[6];
    audio.value.play();
  } else if (id === "8") {
    audio.value.src = soundPaths[7];
    audio.value.play();
  }

  throttledCounter++
}, 5000)


const startReading = () => {
  console.log("startReading");
  stopSounds();
  finalFrame.value = false;
  throttledCounter = 0;


  qrScanner = new QrScanner(
    videoElem.value,
    (data) => {
      id = data.data.split('?id=')[1];

      playThrottled(id);
    },
    { returnDetailedScanResult: true, highlightScanRegion: true }
  );
  qrScanner.start();
  scanning.value = true;
};

const stopReading = () => {
  console.log("stopReading");
  qrScanner.stop();
  stopSounds();
  scanning.value = false;
};
</script>

<style scoped>
.outer {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  user-select: none;
  color: #fff;
}

.video {
  position: fixed;
  width: 100dvw;
  height: 100dvh;
  z-index: -1;
  opacity: 0.5;
  object-fit: cover;
}

.controls {
  color: #fff;
  font-family: "Courier New", Courier, monospace;
  font-size: 40px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  text-align: center;
  user-select: none;
}

.code {
  font-size: 20px;
  color: yellow;
}

.audio {
  display: none;
}
</style>
