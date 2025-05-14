<template>
  <div class="outer">
    <audio v-for="story in stories" ref="storiesRef" :src="story.path" no-controls />
    <video class="video" ref="videoElem" />
    <div v-if="finalFrame" class="final">DU BISCH... </div>
    <div v-if="!scanning && finalFrame" class="controls" @click="startReading()">NEUSTART</div>
    <div v-if="!scanning && !finalFrame" class="controls" @click="startReading()">START</div>
    <div v-if="scanning && !finalFrame" class="controls" @click="stopReading()">
      <span class="stop">STOP</span><br />
    </div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";

const finalFrame = ref(false);
const videoElem = ref();
const scanning = ref(false);
let name = ""
let previousName = ""
let throttledCounter = 0;
let gonnaEnd = false;
let ended = false;
const stories = [
  {
    path: '/sounds/1.mp3',
    name: 'Spinnentanz',
    beschreibung: 'Eine Geschichte von 7 Spinnen, die einen Tanz tanzen und singen.'
  },
  {
    path: '/sounds/2.mp3',
    name: 'Perlenschatz',
    beschreibung: 'Eine Geschichte von einem Perlenkönig, der seinen Schatz sucht.'
  },
  {
    path: '/sounds/3.mp3',
    name: 'Kleines Mädchen',
    beschreibung: 'Eine Geschichte von einem kleinen Mädchen, das in einem Korb sitzt und häkelt.'
  },
  {
    path: '/sounds/4.mp3',
    name: "Fingerring verloren",
    beschreibung: 'Eine Geschichte von einem Zwerg, der einen Fingerring verliert und ihn wieder findet.'
  },
  {
    path: '/sounds/5.mp3',
    name: 'Königin der Nacht',
    beschreibung: 'Eine Geschichte von einer Königin, die Party feiert und mit ihren Gästen Poker spielt.'
  },
  {
    path: '/sounds/6.mp3',
    name: 'Zauberwald',
    beschreibung: 'Eine Geschichte von einem magischen Wald, wo die Bäume Geschichten erzählen und die Blumen singen.'
  },
  {
    path: '/sounds/7.mp3',
    name: 'Mondscheindrache',
    beschreibung: 'Eine Geschichte von einem kleinen Drachen, der nachts im Mondschein tanzt und Sterne sammelt.'
  },
  {
    path: '/sounds/8.mp3',
    name: 'Regenbogenfisch',
    beschreibung: 'Eine Geschichte von einem bunten Fisch, der in einer Unterwasserstadt Musik macht und andere Fische zum Lachen bringt.'
  },
  {
    path: '/sounds/final.mp3',
    name: 'Konklusion',
    beschreibung: 'Eine Geschichte, die alles zusammenfasst und ein Ende macht.'
  }
];

const storiesRef = ref();
const storiesMedia = ref([]);
whenever(storiesRef, () => {
  storiesRef.value.forEach((story, index) => {
    storiesMedia.value.push({
      name: stories[index].name,
      media: useMediaControls(story)
    })
  });
})

const stopSounds = () => {
  if (storiesMedia.value.length > 0) {
    storiesMedia.value.forEach(story => {
      story.media.playing = false
      story.media.currentTime = 0
    });
  }
}

const playThrottled = useThrottleFn((name) => {
  throttledCounter++
  stopSounds();
  storiesMedia.value.forEach(story => {
    if (story.name === name) {
      if (throttledCounter > 1) {
        gonnaEnd = true
        console.log("second qr scanned")
        console.log(story.media.duration)
        setTimeout(() => {
          console.log("ended")
          ended = true
          finalFrame.value = true
          stopReading()
        }, story.media.duration * 1000 - 100)
      }
      story.media.playing = true;
      if (previousName === name) {
        console.log("same name")
      }
      previousName = name
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
}

.code {
  font-size: 20px;
  color: yellow;
}
</style>
