<template>
    <div class="container">
        <div class="qr-reader" id="reader"></div>
    </div>
    <div class="debug">
        <div>{{ id }}</div>
    </div>
</template>

<script setup>
import { Html5QrcodeScanner } from 'html5-qrcode';

function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    id.value = decodedText;
}

const id = ref('safsadfasdfsadf');

onMounted(() => {
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 300, rememberLastUsedCamera: true });
    html5QrcodeScanner.render(onScanSuccess);
});
</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: red;
}

.qr-reader {
    width: 100%;
    height: 100%;
    background-color: blue;
}

.debug {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: red;
    color: blue;
    z-index: 9999999999999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.html5-qrcode-element {
    display: none;
}

#reader__dashboard_section {
    display: none !important;
}
</style>