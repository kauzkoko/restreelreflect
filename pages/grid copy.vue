<template>
  <div class="grid">
    <div v-for="qr in qrArray" class="qr" :style="{ backgroundColor: qr.letter === 'a' ? 'red' : qr.letter === 'b' ? 'blue' : 'white' }">
      <div>{{ qr.type }}</div>
      <div style="font-size: 50px;">{{ qr.letter }}</div>
      <div>{{ qr.id }}</div>
      <img :src="qr.qr" class="qr" />
    </div>
  </div>
</template>

<script setup>
const qrArray = ref([]);

scores.forEach((score, i) => {
  console.log(score.name, score.id);
  qrArray.value.push({
    type: score.type,
    letter: score.letter,
    id: score.id,
    qr: useQR("rerere.cc/" + score.id, {
      margin: 5,
      errorCorrectionLevel: "H",
    })
  }

  );
});
</script>

<style>
.grid {
  background-color: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
  width: 100dvw;
  height: 100dvh;
}

.qr {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>