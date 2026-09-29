const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;
let direction;
let score;
let game;

// Difficulty speeds
const levels = {
  easy: 180,
  medium: 100,
  hard: 60,
};

let difficulty = "easy";

// Start game
function startGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 },
  ];

  direction = "RIGHT";
  score = 0;

  document.getElementById("score").textContent = score;

  createFood();

  // Stop previous game
  clearInterval(game);

  // Start game with selected speed
  game = setInterval(drawGame, levels[difficulty]);
}

// Change difficulty
function setDifficulty(level) {
  difficulty = level;

  // Restart game with new difficulty
  startGame();
}

// Create food
function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };

  // Make sure food doesn't appear inside snake
  for (let part of snake) {
    if (part.x === food.x && part.y === food.y) {
      createFood();
      return;
    }
  }
}

// Draw game
function drawGame() {
  // Clear canvas
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";

  ctx.fillRect(food.x, food.y, box - 1, box - 1);

  // Draw snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#22c55e" : "#4ade80";

    ctx.fillRect(part.x, part.y, box - 1, box - 1);
  });

  // Create new head
  let head = {
    x: snake[0].x,
    y: snake[0].y,
  };

  // Move snake
  if (direction === "UP") {
    head.y -= box;
  }

  if (direction === "DOWN") {
    head.y += box;
  }

  if (direction === "LEFT") {
    head.x -= box;
  }

  if (direction === "RIGHT") {
    head.x += box;
  }

  // Wall collision
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    gameOver();
    return;
  }

  // Snake collision
  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      gameOver();
      return;
    }
  }

  // Add new head
  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score++;

    document.getElementById("score").textContent = score;

    createFood();
  } else {
    // Remove tail
    snake.pop();
  }
}

// Game over
function gameOver() {
  clearInterval(game);

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  ctx.font = "30px Arial";

  ctx.textAlign = "center";

  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

  ctx.font = "18px Arial";

  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 35);
}

// Keyboard controls
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  }

  if (event.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }

  if (event.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  }

  if (event.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }
});

// Restart game
function restartGame() {
  startGame();
}

// Start game
startGame();
