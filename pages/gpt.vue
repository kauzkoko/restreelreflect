<template>
    <div class="console">
      <div class="checkboxes">
        <div>
          <input type="checkbox" id="refs" v-model="showRefs">
          <label for="refs">Refs</label>
        </div>
        <div>
          <input type="checkbox" id="controls" v-model="showControls">
          <label for="controls">Show Controls</label>
        </div>
      </div>
      <div v-if="showRefs">
        <div>Current State: {{ currentState }}</div>
        <div>Targeted QR: {{ targetedQR }}</div>
        <div>Current Sound: {{ currentSound }}</div>
        <div>Is Any Sound Playing: {{ isAnyAudioPlaying }}</div>
        <div>Can Scan: {{ canScan }}</div>
        <div>Scanned ID: {{ scannedId }}</div>
        <div>Same ID Counter: {{ sameIdCounter }}</div>
        <div>Last Question: {{ lastQuestion }}</div>
        <div>Answers Given: {{ answersGiven }}</div>
        <div>Is Scanning: {{ isScanning }}</div>
      </div>
    </div>
    
    <div class="container">
      <video class="video" ref="videoRef" />
      <svg class="customOverlay" v-if="isScanning"
        :class="currentState"
        viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect id="square" x="10" y="10" width="80" height="80" rx="2" ry="2" fill="none" stroke-width="4"
          stroke-dasharray="40, 40" :stroke-dashoffset="offset" />
      </svg>
      
      <div class="state" v-if="currentState === 'start'">
        <div>Welcome to</div>
        <div class="title">Rest, Reel, Reflect</div>
        <div>
          <ol>
            <li>Put the audio cable on the bed into your phone.</li>
            <li>Click start and enable camera access when asked.</li>
            <li>Scan Q1, Q2, or Q3 QR codes to hear questions.</li>
            <li>Answer with A or B QR codes after each question.</li>
          </ol>
        </div>
        <div>
          <div class="startButton" @click="start()">
            <div>Start</div>
          </div>
        </div>
      </div>
      
      <div class="state" v-if="currentState === 'ready'">
        <div class="readyText">
          Scan Q1, Q2, or Q3 QR codes to hear questions.
        </div>
      </div>
      
      <div class="state" v-if="currentState === 'waitingForAnswer'">
        <div class="readyText">
          Answer by scanning [A] or [B] QR codes.
        </div>
        <div class="lastQuestion">Last question: {{ lastQuestion }}</div>
      </div>
      
      <div class="state" v-if="currentState === 'playingQuestion'">
        <div>Playing Question: {{ currentSound }}</div>
        <div class="pulsingText">🎵 Listen...</div>
      </div>
      
      <div class="state" v-if="currentState === 'playingAnswer'">
        <div>Playing Answer</div>
        <div class="pulsingText">🎵 Listen...</div>
      </div>
      
      <div class="state" v-if="currentState === 'playingConfirmation'">
        <div class="pulsingText">✓ Answer recorded!</div>
      </div>
      
      <div class="controls" v-if="showControls">
        <div>
          <button @click="goToState('start')">Start</button>
          <button @click="goToState('ready')">Ready</button>
          <button @click="goToState('waitingForAnswer')">Wait for Answer</button>
          <button @click="stopAllAudio">Stop All Audio</button>
          <button @click="resetExhibition">Reset</button>
        </div>
        <div>
          <button @click="testQuestion('Q1')">Test Q1</button>
          <button @click="testQuestion('Q2')">Test Q2</button>
          <button @click="testQuestion('Q3')">Test Q3</button>
          <button @click="testAnswer('A')">Test A</button>
          <button @click="testAnswer('B')">Test B</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import QrScanner from "qr-scanner";
  import { Howler } from 'howler';
  import { scores } from '~/utils/stories';
  
  let qrScanner;
  let scanTimer = null;
  
  const showControls = ref(false);
  const showRefs = ref(true);
  const offset = ref(23.5);
  const videoRef = templateRef('videoRef');
  const targetedQR = ref("no QR code targeted");
  const currentSound = ref("no sound playing");
  const isScanning = ref(false);
  const scannedId = ref("");
  const sameIdCounter = ref(0);
  const lastQuestion = ref("");
  const answersGiven = ref([]);
  const isAnyAudioPlaying = ref(false);
  const currentState = ref('start');
  
  // Computed property to determine if scanning is allowed
  const canScan = computed(() => {
    return !isAnyAudioPlaying.value && (currentState.value === 'ready' || currentState.value === 'waitingForAnswer');
  });
  
  // Initialize sound objects
  const { play: playConfirmationSound, isPlaying: isConfirmationSoundPlaying } = useSound('/sounds/confirmation.mp3', {
    volume: 1,
    interrupt: true,
    html5: true,
    onplay: () => {
      isAnyAudioPlaying.value = true;
      currentState.value = 'playingConfirmation';
    },
    onend: () => {
      isAnyAudioPlaying.value = false;
      currentState.value = 'ready';
    }
  });
  
  // Create sound objects for all questions and answers
  const sounds = [];
  scores.forEach(score => {
    const sound = useSound(score.path, {
      volume: 1,
      interrupt: true,
      html5: true,
      onplay: () => {
        isAnyAudioPlaying.value = true;
        currentSound.value = score.name;
        if (score.type === 'question') {
          currentState.value = 'playingQuestion';
        } else {
          currentState.value = 'playingAnswer';
        }
      },
      onend: () => {
        isAnyAudioPlaying.value = false;
        currentSound.value = "no sound playing";
        if (score.type === 'question') {
          lastQuestion.value = score.name;
          currentState.value = 'waitingForAnswer';
        } else {
          // After answer plays, play confirmation sound
          setTimeout(() => {
            playConfirmationSound();
          }, 500);
        }
      }
    });
    
    sounds.push({
      ...score,
      sound: sound
    });
  });
  
  // Watch for audio playing state changes
  watch([isConfirmationSoundPlaying, () => sounds.map(s => s.sound.isPlaying.value)], () => {
    const anyPlaying = isConfirmationSoundPlaying.value || sounds.some(s => s.sound.isPlaying.value);
    isAnyAudioPlaying.value = anyPlaying;
  }, { deep: true });
  
  const goToState = (state) => {
    currentState.value = state;
  };
  
  const start = () => {
    currentState.value = 'ready';
    qrScanner.start();
    isScanning.value = true;
  };
  
  const stopScanning = () => {
    isScanning.value = false;
    if (qrScanner) {
      qrScanner.stop();
    }
    if (scanTimer) {
      clearTimeout(scanTimer);
      scanTimer = null;
    }
  };
  
  const stopAllAudio = () => {
    Howler.stop();
    isAnyAudioPlaying.value = false;
    currentSound.value = "no sound playing";
    currentState.value = 'ready';
  };
  
  const resetExhibition = () => {
    stopAllAudio();
    stopScanning();
    answersGiven.value = [];
    lastQuestion.value = "";
    scannedId.value = "";
    sameIdCounter.value = 0;
    currentState.value = 'start';
  };
  
  const getSoundByName = (name) => {
    return sounds.find(sound => sound.name === name);
  };
  
  const playSound = (soundName) => {
    if (!canScan.value) return;
    
    const soundObj = getSoundByName(soundName);
    if (soundObj) {
      Howler.stop(); // Stop any currently playing sound
      soundObj.sound.play();
    }
  };
  
  // Test functions for controls
  const testQuestion = (questionId) => {
    const questionName = questionId.toLowerCase() + 'q'; // e.g., 'q1' -> '1q'
    playSound(questionName);
  };
  
  const testAnswer = (answer) => {
    if (!lastQuestion.value) {
      alert('Play a question first!');
      return;
    }
    const questionNumber = lastQuestion.value.charAt(0); // Get the number from '1q', '2q', etc.
    const answerName = questionNumber + answer.toLowerCase(); // e.g., '1a' or '1b'
    playSound(answerName);
    answersGiven.value.push({ question: lastQuestion.value, answer: answerName });
  };
  
  const handleQRScan = (qrData) => {
    // If we can't scan right now, ignore the QR code
    if (!canScan.value) {
      return;
    }
  
    // Extract the ID from QR code URL (expecting format like "/1", "/2", "/3", "/a", "/b")
    
    // If it's the same ID as before, increment counter
    if (scannedId.value === qrId) {
      sameIdCounter.value++;
    } else {
      scannedId.value = qrId;
      sameIdCounter.value = 1;
    }
  
    // Clear any existing timer
    if (scanTimer) {
      clearTimeout(scanTimer);
    }
  
    // Set timer for 1 second of continuous scanning
    scanTimer = setTimeout(() => {
      if (sameIdCounter.value >= 10) { // Roughly 1 second of scanning at ~10fps
        processQRCode(qrId);
        sameIdCounter.value = 0;
      }
    }, 1000);
  };
  
  const processQRCode = (qrId) => {
    const upperQrId = qrId.toUpperCase();
    
    // Handle question QR codes (Q1, Q2, Q3)
    if (upperQrId.match(/^Q[1-3]$/)) {
      const questionNumber = upperQrId.charAt(1);
      const questionName = questionNumber + 'q'; // Convert 'Q1' to '1q'
      playSound(questionName);
    }
    // Handle answer QR codes (A, B)
    else if (upperQrId === 'A' || upperQrId === 'B') {
      if (currentState.value === 'waitingForAnswer' && lastQuestion.value) {
        const questionNumber = lastQuestion.value.charAt(0);
        const answerName = questionNumber + upperQrId.toLowerCase(); // e.g., '1a' or '1b'
        playSound(answerName);
        answersGiven.value.push({ 
          question: lastQuestion.value, 
          answer: answerName,
          timestamp: new Date().toISOString()
        });
      }
    }
  };
  
  const scanCallback = (data) => {
    handleQRScan(data.data);
  };
  
  onMounted(() => {
    qrScanner = new QrScanner(
      videoRef.value,
      scanCallback,
      { 
        returnDetailedScanResult: true,
        highlightScanRegion: false,
        highlightCodeOutline: false
      }
    );
  });
  
  onUnmounted(() => {
    stopScanning();
    stopAllAudio();
    if (qrScanner) {
      qrScanner.destroy();
    }
  });
  </script>
  
  <style scoped>
  .container {
    font-family: 'Inter', sans-serif;
    color: white;
    font-size: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
  }
  
  .customOverlay {
    position: fixed;
    top: 50dvh;
    left: 50dvw;
    width: 100dvw;
    height: 100dvh;
    transform: translate(-50%, -50%);
    background: transparent;
    pointer-events: none;
    stroke: #647E99;
    opacity: 0.8;
    transition: stroke 0.5s linear;
  }
  
  .ready {
    stroke: #5D7185;
  }
  
  .waitingForAnswer {
    stroke: #36699C;
  }
  
  .playingQuestion, .playingAnswer, .playingConfirmation {
    stroke: #3481CF;
  }
  
  .video {
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    z-index: -1;
    opacity: 0.5;
    object-fit: cover;
  }
  
  .startButton {
    background-color: white;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 20px;
    transition: all 0.2s ease;
  }
  
  .startButton:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }
  
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 85%;
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }
  
  .state li {
    text-align: left;
    margin: 5px 0;
  }
  
  .readyText {
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: bold;
  }
  
  .title {
    font-size: 32px;
    font-weight: bold;
    margin: 15px 0;
  }
  
  .lastQuestion {
    margin-top: 10px;
    font-size: 18px;
    color: #FFD700;
  }
  
  .pulsingText {
    font-size: 28px;
    animation: pulse 2s infinite;
    margin-top: 10px;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  .console {
    position: absolute;
    top: 10px;
    left: 10px;
    color: red;
    font-size: 14px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    border-radius: 5px;
    max-width: 300px;
    z-index: 1000;
  }
  
  .console div {
    margin: 2px 0;
  }
  
  .checkboxes {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
  }
  
  .checkboxes label {
    color: white;
    margin-left: 5px;
  }
  
  .controls {
    position: absolute;
    bottom: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
  }
  
  .controls div {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .controls button {
    font-size: 12px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .controls button:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  </style>