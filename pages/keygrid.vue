<template>
  <div class="full">
    <div class="qr">
      <div>{{ qr.type }}</div>
      <div style=" font-size: 50px;">{{ qr.letter }}</div>
    <div>{{ qr.id }}</div>
    <img :src="qr.qr" class="qr" />
  </div>
  </div>
</template>

<script setup>
const qrArray = ref([]);

questions.forEach((score, i) => {
  console.log(score.name, score.id);
  qrArray.value.push({
    type: score.type,
    letter: score.letter,
    id: score.id,
    qr: useQR("rerere.cc/" + score.id, {
      margin: 5,
      errorCorrectionLevel: "H",
    })
  });
});

qrArray.value.push({
  type: 'answer',
  letter: 'a',
  id: 4,
  qr: useQR("rerere.cc/4", {
    margin: 5,
    errorCorrectionLevel: "H",
  })
})

qrArray.value.push({
  type: 'answer',
  letter: 'b',
  id: 5,
  qr: useQR("rerere.cc/5", {
    margin: 5,
    errorCorrectionLevel: "H",
  })
})

const { state: qr, next, prev, go } = useCycleList(qrArray)

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
  next()
})

onKeyStroke('ArrowUp', (e) => {
  e.preventDefault()
  prev()
})

onKeyStroke('ArrowRight', (e) => {
  e.preventDefault()
  next()
})

onKeyStroke('ArrowLeft', (e) => {
  e.preventDefault()
  prev()
})

onKeyStroke('0', (e) => {
  e.preventDefault()
  go(0)
})

onKeyStroke('1', (e) => {
  e.preventDefault()
  go(1)
})

onKeyStroke('2', (e) => {
  e.preventDefault()
  go(2)
})

onKeyStroke('3', (e) => {
  e.preventDefault()
  go(3)
})

onKeyStroke('4', (e) => {
  e.preventDefault()
  go(4)
})

onKeyStroke('5', (e) => {
  e.preventDefault()
  go(5)
})

onKeyStroke('a', (e) => {
  e.preventDefault()
  go(4)
})

onKeyStroke('b', (e) => {
  e.preventDefault()
  go(5)
})




</script>

<style>
.full {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  height: 100dvh;
}

.qr {
  width: 50vw;
  aspect-ratio: 1/1;
  object-fit: contain;
}
</style>