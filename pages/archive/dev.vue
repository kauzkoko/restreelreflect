<template>
  <div class="outer">
    <video class="video" ref="videoElem" />
    <div v-if="!isPlaying" class="controls" @click="playSound()">play sound</div>
    <div v-else class="controls" @click="stopSound()">stop sound</div>
    <div v-if="!scanning" class="controls" @click="startReading()">START</div>
    <div v-else class="controls" @click="stopReading()">
      STOP<br />
      <span class="code">{{ id }}</span><br />
      <span class="code-counter">{{ codeCounter }}</span>
    </div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Howl, Howler } from 'howler';

const videoElem = ref();
const qrScanner = ref();
const code = ref("Nothing detected yet");
const codeCounter = ref(0);
const scanning = ref(false);
const id = ref(0);
const sound1 = useSoundComposable('/sounds/1.mp3');
const sound2 = useSoundComposable('/sounds/2.mp3');
const sound3 = useSoundComposable('/sounds/3.mp3');
const sound4 = useSoundComposable('/sounds/4.mp3');
const sound5 = useSoundComposable('/sounds/5.mp3');
const sound6 = useSoundComposable('/sounds/6.mp3');
const sound7 = useSoundComposable('/sounds/7.mp3');
const sound8 = useSoundComposable('/sounds/8.mp3');

const playThrottled = useThrottleFn((id) => {
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
}, 3000)

onMounted(() => {
  qrScanner.value = new QrScanner(
    videoElem.value,
    (data) => {

      console.log(data);
      code.value = data.data;
      codeCounter.value++;

      id.value = data.data.split('?id=')[1];

      playThrottled(id.value);
    },
    { returnDetailedScanResult: true, highlightScanRegion: true }
  );
});

onKeyStroke("e", () => {
  startReading()
});

const startReading = () => {
  console.log("startReading");
  qrScanner.value.start();
  scanning.value = true;
};

const stopReading = () => {
  console.log("stopReading");
  qrScanner.value.stop();
  Howler.stop();
  scanning.value = false;
};

const playSound = () => {
  play();
};

const stopSound = () => {
  stop();
};
</script>

<style scoped>
.outer {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
}

.code {
  font-size: 20px;
  color: yellow;
}
</style>
