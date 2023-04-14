const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const endScreen = document.getElementById('endScreen');
const restartBtn = document.getElementById('restartBtn');
const currentScoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerImg = new Image();
playerImg.src = 'player.png';
const obstacleImg = new Image();
obstacleImg.src = 'obstacle1.png';
const volumeControl = document.getElementById('volumeControl');

let highScore = 0;
let score = 0;
let gameOver = false;

// Keyboard event listeners
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  bullets: []
};

const obstacles = [];

volumeControl.addEventListener('input', () => {
  backgroundMusic.volume = volumeControl.value / 100;
});

restartBtn.addEventListener('click', () => {
  endScreen.style.display = 'none';
  resetGame();
  gameLoop();
});

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  // This code will play the background Music once the start button is pressed
  backgroundMusic.volume = 0.2; // Set the volume to 80%
  backgroundMusic.play();
  backgroundMusic.loop = true;
  gameLoop();
});

player.bullets.forEach((bullet, bIndex) => {
  if (
    bullet.x < obstacle.x + obstacle.width &&
    bullet.x + bullet.width > obstacle.x &&
    bullet.y < obstacle.y + obstacle.height &&
    bullet.y + bullet.height > obstacle.y
  ) {
    obstacles.splice(index, 1);
    player.bullets.splice(bIndex, 1);
    score++; // Increase the score by 1
  }
});


function resetGame() {
  gameOver = false;
  obstacles.length = 0;
  player.bullets.length = 0;
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 60;
  score = 0;
}





class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 7;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function spawnObstacle() {
  const obstacle = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: 2
  };
  obstacles.push(obstacle);
}


function checkCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}


function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player
  if (leftPressed && player.x > 0) {
    player.x -= player.speed;
  }
  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }

  // Update bullets
  player.bullets.forEach((bullet, index) => {
    bullet.update();
    if (bullet.y < 0) {
      player.bullets.splice(index, 1);
    }
    bullet.draw();
  });

  // Update obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacle.speed;

    // Check for collision with player
    if (startScreen.style.display === 'none' && checkCollision(player, obstacle)) {
      gameOver = true;
      return;
    }

    // Check for collision
    player.bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < obstacle.x + obstacle.width &&
        bullet.x + bullet.width > obstacle.x &&
        bullet.y < obstacle.y + obstacle.height &&
        bullet.y + bullet.height > obstacle.y
      ) {
        obstacles.splice(index, 1);
        player.bullets.splice(bIndex, 1);
        score++; // Increase the score by 1
      }
    });

    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
    }
    ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}



document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') leftPressed = true;
  if (event.code === 'ArrowRight') rightPressed = true;
  if (event.code === 'Space') spacePressed = true;
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') leftPressed = false;
  if (event.code === 'ArrowRight') rightPressed = false;
  if (event.code === 'Space') spacePressed = false;
});

// Spawn obstacles periodically
setInterval(spawnObstacle, 2000);

// Game loop
// Game loop
function gameLoop() {
  update();

  if (gameOver) {
    backgroundMusic.pause(); // Pause the background music

    // Update and show the end screen
    currentScoreElement.textContent = `Current Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = `High Score: ${highScore}`;
    }
    endScreen.style.display = 'flex';

    return; // Exit the game loop
  }

  if (spacePressed && player.bullets.length < 1) {
    player.bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
  }

  requestAnimationFrame(gameLoop);
}


gameLoop();

