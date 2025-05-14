<template>
    <div class="chat-container">
        <input v-model="inputData">
        <button @click="sendMessage" v-text="'Send'" />
        <div>{{ data }}</div>
    </div>
</template>

<script setup>
const { chat } = useChatgpt()

const data = ref('')
const inputData = ref('')

async function sendMessage() {
    try {
        const response = await chat(inputData.value)
        data.value = response
    } catch (error) {
        alert(`Join the waiting list if you want to use GPT-4 models: ${error}`)
    }
}
</script>

<style>
.chat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #fff;
}
</style>