let words = [];
let timerInterval;
let gameInProgress = false;
let score = 0;
let timer;
let timeLeft;
let isGameRunning = false;
let currentMode = '';
const GAME_MODES = ['charades', 'taboo', 'one-syllab', 'eyes-closed', 'sounds'];
const TITLES = {
    'charades': 'Charades 🎭',
    'taboo': 'Taboo 🚫',
    'one-syllab': 'One Syllable 1️⃣',
    'eyes-closed': 'Eyes Closed Charades 👁️',
    'sounds': 'Sounds 🔊',
};
const MODE_TIMES = {
    'charades': 120,
    'taboo': 15,
    'one-syllab': 60,
    'eyes-closed': 120,
    'sounds': 60,
};

// Load the words from the YAML file
fetch('./assets/game_words.yaml')
    .then(response => response.text())
    .then(text => {
        const data = jsyaml.load(text);
        // Flatten the categories into a single array of words, excluding 'actions'
        const { actions, difficult, ...categories } = data.charades;
        words = Object.values(categories).flat();
    })
    .catch(error => console.error('Error loading words:', error));

function getNewWord(scored) {
    if (!isGameRunning) return;
    
    if (scored) {
        score++;
        document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    }
    
    if (words.length === 0) {
        document.getElementById('wordDisplay').textContent = 'Error loading words';
        return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    document.getElementById('wordDisplay').textContent = words[randomIndex];
}

function selectRandomMode() {
    const randomIndex = Math.floor(Math.random() * GAME_MODES.length);
    currentMode = GAME_MODES[randomIndex];
    
    // Update display and buttons
    document.getElementById('modeDisplay').textContent = TITLES[currentMode];
    document.getElementById('modeButton').style.display = 'none';
    document.getElementById('startButton').style.display = 'inline-block';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('timer').textContent = MODE_TIMES[currentMode]; // Show initial time for selected mode
}

function startGame() {
    // Check if mode is selected
    if (!currentMode) {
        alert('Please select a game mode first!');
        return;
    }
    
    score = 0;
    document.getElementById('scoreDisplay').textContent = 'Score: 0';
    timeLeft = MODE_TIMES[currentMode];  // Set time based on selected mode
    isGameRunning = true;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('newWordButton').style.display = 'inline-block';
    document.getElementById('skipButton').style.display = 'inline-block';
    getNewWord(false);
    startTimer();
}

function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    document.getElementById('timer').textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    isGameRunning = false;
    currentMode = ''; // Reset mode
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('modeButton').style.display = 'inline-block';
    document.getElementById('newWordButton').style.display = 'none';
    document.getElementById('skipButton').style.display = 'none';
    document.getElementById('wordDisplay').textContent = `Game Over! Final Score: ${score}`;
    document.getElementById('modeDisplay').textContent = ''; // Clear mode display
    document.getElementById('timer').style.display = 'none'; // Hide timer when game ends
    clearInterval(timerInterval);
}

// When page loads, hide start button until mode is selected
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startButton').style.display = 'none';
}); 