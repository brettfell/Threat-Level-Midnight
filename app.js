const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;
// --- LOAD ASSETS ---
const imgWall = new Image(); imgWall.src = 'wall.png';
const imgFloor = new Image(); imgFloor.src = 'floor.png';
const imgGoldenface = new Image(); imgGoldenface.src = 'goldenface.png';
const imgScarn = new Image(); imgScarn.src = 'scarn.png';


// 0 = Floor, 1 = Wall, 2 = Goldenface
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 2, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Our Hero
const player = {
    x: 32, // Start at tile [1][1]
    y: 32,
    size: 24, // Slightly smaller than a tile so he fits through doors easily
    speed: 3,
    color: '#3b82f6' // Scarn Blue
};

// Input Tracking
const keys = { up: false, down: false, left: false, right: false };

// --- CONTROLLER WIRING ---
// Keyboard support (for testing on your computer)
window.addEventListener('keydown', (e) => setKey(e.key, true));
window.addEventListener('keyup', (e) => setKey(e.key, false));

function setKey(key, isPressed) {
    if (key === 'ArrowUp' || key === 'w') keys.up = isPressed;
    if (key === 'ArrowDown' || key === 's') keys.down = isPressed;
    if (key === 'ArrowLeft' || key === 'a') keys.left = isPressed;
    if (key === 'ArrowRight' || key === 'd') keys.right = isPressed;
}

// Mobile D-Pad support
const bindBtn = (id, dir) => {
    const btn = document.getElementById(id);
    if (!btn) return; // Safety check in case HTML is missing
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[dir] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[dir] = false; });
    btn.addEventListener('mousedown', () => keys[dir] = true);
    btn.addEventListener('mouseup', () => keys[dir] = false);
    btn.addEventListener('mouseleave', () => keys[dir] = false);
};

bindBtn('btn-up', 'up');
bindBtn('btn-down', 'down');
bindBtn('btn-left', 'left');
bindBtn('btn-right', 'right');

// --- DIALOGUE SYSTEM ---
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
let isPaused = false; // Stops Scarn from moving while talking

// Click the text box to close it
if (dialogueBox) {
    dialogueBox.addEventListener('click', () => {
        dialogueBox.classList.add('hidden');
        isPaused = false; // Unfreeze the game!
        
        // Bounce the player back slightly so they don't get stuck in an infinite dialogue loop
        player.y += 10; 
    });
}

function triggerDialogue(text) {
    if (isPaused) return; // Don't trigger if already talking
    isPaused = true;
    keys.up = keys.down = keys.left = keys.right = false; // Let go of all buttons
    
    if (dialogueText && dialogueBox) {
        dialogueText.innerText = text;
        dialogueBox.classList.remove('hidden');
    }
}

// --- PHYSICS & COLLISION ---
function getTile(x, y) {
    let col = Math.floor(x / TILE_SIZE);
    let row = Math.floor(y / TILE_SIZE);
    
    // Safety check to prevent crashing if player walks off the absolute edge of the map array
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return 1; // Treat out-of-bounds as a wall
    }
    return map[row][col];
}

function checkCollision(x, y) {
    // Check all 4 corners of the player's square
    const corners = [
        getTile(x, y),
        getTile(x + player.size - 1, y),
        getTile(x, y + player.size - 1),
        getTile(x + player.size - 1, y + player.size - 1)
    ];

    // Did we bump into Goldenface? (Tile 2)
    if (corners.includes(2)) {
        triggerDialogue("Scarn... I've been expecting you. The pucks are armed!");
        return true; // Treat him like a solid wall so we can't walk through him
    }

    // Did we bump into a Wall? (Tile 1)
    if (corners.includes(1)) {
        return true; 
    }

    return false; // The path is clear!
}

function update() {
    if (isPaused) return; // Freeze all math if a text box is open!

    let newX = player.x;
    let newY = player.y;

    if (keys.up) newY -= player.speed;
    if (keys.down) newY += player.speed;
    if (keys.left) newX -= player.speed;
    if (keys.right) newX += player.speed;

    // Only move if the new coordinates don't hit a wall or Goldenface
    if (!checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
}

// --- RENDER ENGINE ---
function draw() {
    // 1. Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the Map
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            let tile = map[row][col];
            let x = col * TILE_SIZE;
            let y = row * TILE_SIZE;

            if (tile === 1) {
                ctx.fillStyle = '#475569'; // Wall
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === 0) {
                ctx.fillStyle = '#1e293b'; // Floor
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === 2) {
                ctx.fillStyle = '#eab308'; // Goldenface
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // 3. Draw Scarn
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// --- THE GAME LOOP ---
function gameLoop() {
    update(); // Calculate math
    draw();   // Paint screen
    requestAnimationFrame(gameLoop); // Do it again 60x a second
}

// Start the engine
gameLoop();
