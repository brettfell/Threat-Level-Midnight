const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;

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

// --- PHYSICS & COLLISION ---
function isWall(x, y) {
    // Convert pixel coordinates back into map grid coordinates
    let col = Math.floor(x / TILE_SIZE);
    let row = Math.floor(y / TILE_SIZE);
    return map[row][col] === 1; // 1 means Wall
}

function update() {
    let newX = player.x;
    let newY = player.y;

    if (keys.up) newY -= player.speed;
    if (keys.down) newY += player.speed;
    if (keys.left) newX -= player.speed;
    if (keys.right) newX += player.speed;

    // Hitbox check: Only move if all 4 corners of the player are NOT touching a wall
    if (!isWall(newX, newY) && 
        !isWall(newX + player.size, newY) && 
        !isWall(newX, newY + player.size) && 
        !isWall(newX + player.size, newY + player.size)) {
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
                ctx.fillStyle = '#475569'; // Wall Color
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === 0) {
                ctx.fillStyle = '#1e293b'; // Floor Color
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (tile === 2) {
                ctx.fillStyle = '#eab308'; // Goldenface Color
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
