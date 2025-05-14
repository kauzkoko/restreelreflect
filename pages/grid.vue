<template>
  <div class="grid">
    <img :src="qr.value" v-for="qr in qrArray" class="qr" />
  </div>
</template>

<script setup>
const qrArray = ref([]);
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

stories.forEach((story, i) => {
  let urlName = story.name.replace(/\s+/g, '_')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue');
  console.log(urlName);
  qrArray.value.push(
    useQR("https://daerustruggles.netlify.app/scanner?name=" + urlName, {
      margin: 5,
      errorCorrectionLevel: "H",
    })
  );
});
</script>

<style>
.grid {
  background-color: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
}

.qr {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>