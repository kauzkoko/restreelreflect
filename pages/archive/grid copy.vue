<template>
  <div class="grid">
    <img :src="qr.value" v-for="qr in qrArray" class="qr" />
  </div>
</template>

<script setup>
const qrArray = ref([]);
for (var i = 1; i < 9; i++) {
  qrArray.value.push(
    useQR("https://daerustruggles.netlify.app/scanner?id=" + i, {
      margin: 5,
      errorCorrectionLevel: "H",
    })
  );
}
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