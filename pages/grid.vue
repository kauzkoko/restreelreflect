<template>
  <div class="grid">
    <img :src="qr.value" v-for="qr in qrArray" class="qr" />
  </div>
</template>

<script setup>
const qrArray = ref([]);

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