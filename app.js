// Screen Elements
const storyScreen = document.getElementById('story-screen');
const battleScreen = document.getElementById('battle-screen');
const bombScreen = document.getElementById('bomb-screen');
const storyText = document.getElementById('story-text');

// --- SCENE MANAGER ---
function showScreen(screenToShow) {
    // Hide all screens
    storyScreen.classList.add('hidden');
    battleScreen.classList.add('hidden');
    bombScreen.classList.add('hidden');
    
    // Show the requested screen
    screenToShow.classList.remove('hidden');
}

// --- DUMMY GAME FLOW ---

// Called by the button on the Story Screen
function startBattle() {
    showScreen(battleScreen);
    // Here we would initialize Goldenface's stats
}

// Called by the button on the Battle Screen
function dummyWinBattle() {
    alert("You shot Goldenface! But he triggered the bomb!");
    showScreen(bombScreen);
    // Here we would start the bomb countdown timer
}

// Called by the wires on the Bomb Screen
function defuseBomb(color) {
    if (color === 'blue') {
        alert("Bomb defused! You saved the NHL All-Star Game!");
        // Return to story mode for the ending
        storyText.innerText = '"Cleanup on aisle five," you whisper to yourself as you walk away in slow motion.';
        document.getElementById('story-choices').innerHTML = ''; // Clear buttons
        showScreen(storyScreen);
    } else {
        alert("BOOM! You cut the wrong wire. Toby laughs in the distance.");
        location.reload(); // Restart game
    }
}

