<template>
  <div class="grid">
    <div v-for="(qr, index) in qrArray" class="qr">
      <div style="font-size: 50px;">{{ qr.id }}</div>
      <img :src="qr.qr" class="qr" />
    </div>
    <div class="bg-red-500 p-5 flex flex-col items-center justify-center">
      <div style="font-size: 50px;">A</div>
      <img :src="qrA" class="qr" />
    </div>
    <div class="bg-blue-500 p-5 flex flex-col items-center justify-center">
      <div style="font-size: 50px;">B</div>
      <img :src="qrB" class="qr" />
    </div>
  </div>
</template>

<script setup>
const qrArray = ref([]);

for (let i = 1; i < 21; i++) {
  qrArray.value.push({
    type: 'question',
    letter: 'q',
    id: i < 10 ? '0' + i : i,
    qr: useQR("rerere.cc/" + (i < 10 ? '0' + i : i), {
      margin: 5,
      errorCorrectionLevel: "H",
    })
  });
}

const qrA = useQR("rerere.cc/40", {
  margin: 5,
  errorCorrectionLevel: "H",
})

const qrB = useQR("rerere.cc/70", {
  margin: 5,  
  errorCorrectionLevel: "H",
})
</script>

<style>
.grid {
  background-color: white;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 50px;
  width: 100dvw;
}

.qr {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>