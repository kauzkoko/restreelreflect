<template>
  <div class="outer">
    <video class="video" ref="videoElem" />
    <div v-if="finalFrame" class="final">{{ response }}</div>
    <div v-if="!scanning && finalFrame" class="controls" @click="startReading()">NEUSTART</div>
    <div v-if="!scanning && !finalFrame" class="controls" @click="startReading()">START</div>
    <div v-if="scanning && !finalFrame" class="controls" @click="stopReading()">
      <!-- <span>{{ isSpeaking ? "speakin" : "" }}</span><br /> -->
      <span class="stop">STOP</span><br />
    </div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
import { Howl, Howler } from 'howler';

let sounds = [];
stories.forEach(story => {
  const sound = new Howl({
    src: [story.path]
  });
  sounds.push({
    name: story.name,
    sound: sound
  });
});

const finalFrame = ref(false);
const videoElem = ref();
const scanning = ref(false);
const response = ref("");
const isSpeaking = ref(false);

let name = ""
let previousName = ""
let throttledCounter = 0;
let gonnaEnd = false;
let ended = false;
let playedStories = [];

const stopSounds = () => {
  Howler.stop();
}

const playThrottled = useThrottleFn((name) => {
  throttledCounter++
  sounds.forEach(sound => {
    if (sound.name === name) {
      // Howler.stop();
      sound.sound.play();
    }
  });
}, 3000)

let qrScanner;
onMounted(() => {
  qrScanner = new QrScanner(
    videoElem.value,
    (data) => {
      let queryName = data.data.split('?name=')[1];
      let realName = convertUrlToName(queryName);
      playThrottled(realName);
    },
    { returnDetailedScanResult: true, highlightScanRegion: true }
  );
});

const startReading = () => {
  console.log("startReading");
  stopSounds();
  finalFrame.value = false;
  throttledCounter = 0;
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
  font-family: "Courier New", Courier, monospace;
  font-size: 40px;
  font-weight: bold;
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
  text-transform: uppercase;
  cursor: pointer;
  text-align: center;
  user-select: none;
  border: 1px solid white;
  padding: 10px;
  border-radius: 10px;
}

.final {
  margin-bottom: 20px;
  text-align: center;
  max-width: 70dvw;
}

.code {
  font-size: 20px;
  color: yellow;
}
</style>
