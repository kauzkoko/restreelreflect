<template>
  <div class="outer">
    <video class="video" ref="videoElem" />
    <div v-if="finalFrame" class="controls">DU BISCH... </div>
    <div v-if="!scanning && finalFrame" class="controls" @click="startReading()">NEUSTART</div>
    <div v-if="!scanning && !finalFrame" class="controls" @click="startReading()">START</div>
    <div v-if="scanning && !finalFrame" class="controls" @click="stopReading()">
      <span class="stop">STOP</span><br />
    </div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Howler } from 'howler';

const finalFrame = ref(false);
const videoElem = ref();
const scanning = ref(false);
const id = ref(0);
const throttledCounter = ref(0);
const sound1 = useSoundComposable('/sounds/1.mp3');
const sound2 = useSoundComposable('/sounds/2.mp3');
const sound3 = useSoundComposable('/sounds/3.mp3');
const sound4 = useSoundComposable('/sounds/4.mp3');
const sound5 = useSoundComposable('/sounds/5.mp3');
const sound6 = useSoundComposable('/sounds/6.mp3');
const sound7 = useSoundComposable('/sounds/7.mp3');
const sound8 = useSoundComposable('/sounds/8.mp3');
const soundFinal = useSoundComposable('/sounds/final.mp3');

const playThrottled = useThrottleFn((id) => {
  if (throttledCounter.value > 0) {
    console.log("do some magic")
    soundFinal.play();
    qrScanner.stop();
    scanning.value = false;
    throttledCounter.value = 0;
    finalFrame.value = true;
  } else {
    if (id === "1") {
      sound1.play();
    }
    if (id === "2") {
      sound2.play();
    }
    if (id === "3") {
      sound3.play();
    }
    if (id === "4") {
      sound4.play();
    }
    if (id === "5") {
      sound5.play();
    }
    if (id === "6") {
      sound6.play();
    }
    if (id === "7") {
      sound7.play();
    }
    if (id === "8") {
      sound8.play();
    }
  }
  throttledCounter.value++;
}, 3000)

let qrScanner;
onMounted(() => {
  qrScanner = new QrScanner(
    videoElem.value,
    (data) => {
      id.value = data.data.split('?id=')[1];

      playThrottled(id.value);
    },
    { returnDetailedScanResult: true, highlightScanRegion: true }
  );
});

const startReading = () => {
  Howler.stop();
  finalFrame.value = false;
  console.log("startReading");
  throttledCounter.value = 0;
  qrScanner.start();
  scanning.value = true;
};

const stopReading = () => {
  console.log("stopReading");
  qrScanner.stop();
  Howler.stop();
  scanning.value = false;
  throttledCounter.value = 0;
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
</style>
