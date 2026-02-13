const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.6;
const jumpPower = -12;
let score = 0;

// Player
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    velocityY: 0,
};

// Platforms
let platforms = [
    { x: 0, y: 350, width: 500, height: 50 },
];

function spawnPlatform() {
    const last = platforms[platforms.length - 1];
    const gap = Math.random() * 100 + 100;
    const width = Math.random() * 100 + 50;
    platforms.push({
        x: last.x + last.width + gap,
        y: 300 + Math.random() * 50,
        width: width,
        height: 20
    });
}

// Input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (onGround()) {
            player.velocityY = jumpPower;
        }
    }
});

function onGround() {
    for (let p of platforms) {
        if (
            player.y + player.height >= p.y &&
            player.y + player.height <= p.y + p.height &&
            player.x + player.width > p.x &&
            player.x < p.x + p.width
        ) {
            return true;
        }
    }
    return false;
}

// Game loop
function update() {
    // Gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Collision with platforms
    for (let p of platforms) {
        if (
            player.y + player.height >= p.y &&
            player.y + player.height <= p.y + p.height &&
            player.x + player.width > p.x &&
            player.x < p.x + p.width &&
            player.velocityY >= 0
        ) {
            player.y = p.y - player.height;
            player.velocityY = 0;
        }
    }

    // Move platforms left
    for (let p of platforms) {
        p.x -= 3; // speed
    }

    // Remove offscreen platforms
    platforms = platforms.filter(p => p.x + p.width > 0);

    // Spawn new platform
    if (platforms[platforms.length - 1].x + platforms[platforms.length - 1].width < canvas.width) {
        spawnPlatform();
    }

    // Game over
    if (player.y > canvas.height) {
        alert('Game Over! Score: ' + score);
        score = 0;
        player.y = 300;
        player.velocityY = 0;
        platforms = [
            { x: 0, y: 350, width: 500, height: 50 },
        ];
    }

    // Increase score
    score++;

    draw();
    requestAnimationFrame(update);
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = 'green';
    for (let p of platforms) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Start game
update();