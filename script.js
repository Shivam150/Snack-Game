const gameContainer = document.querySelector(".game-container");
const snakeElement = document.getElementById("snake");
const foodElement = document.getElementById("food");
const obstacle1Element = document.getElementById("obstacle1");
const obstacle2Element = document.getElementById("obstacle2");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const slowDifficulty = document.getElementById("slow");
const mediumDifficulty = document.getElementById("medium");
const hardDifficulty = document.getElementById("hard");

let snake;
let food;
let direction;
let isGameOver = false;
let isGameStarted = false;
let speed = 0; // This will be updated based on the difficulty level
let score = 0;
let intervalId;

let obstacles = [
  { x: 100, y: 100 },
  { x: 200, y: 200 },
];

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * 29) * 10,
    y: Math.floor(Math.random() * 29) * 10,
  };
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const snakePart = document.createElement("div");
    snakePart.style.position = "absolute";
    snakePart.style.width = "10px";
    snakePart.style.height = "10px";
    snakePart.style.backgroundColor = "green";
    snakePart.style.left = segment.x + "px";
    snakePart.style.top = segment.y + "px";
    snakeElement.appendChild(snakePart);
  });
}

function drawFood() {
  foodElement.style.left = food.x + "px";
  foodElement.style.top = food.y + "px";
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    const obstacleElement = document.createElement("div");
    obstacleElement.style.position = "absolute";
    obstacleElement.style.width = "10px";
    obstacleElement.style.height = "10px";
    obstacleElement.style.backgroundColor = "gray";
    obstacleElement.style.left = obstacle.x + "px";
    obstacleElement.style.top = obstacle.y + "px";
    gameContainer.appendChild(obstacleElement);
  });
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= gameContainer.clientWidth ||
    head.y < 0 ||
    head.y >= gameContainer.clientHeight
  ) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  for (let i = 0; i < obstacles.length; i++) {
    if (head.x === obstacles[i].x && head.y === obstacles[i].y) {
      return true;
    }
  }
  return false;
}

function moveSnake() {
  if (isGameOver) return;

  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y -= 10;
      break;
    case "down":
      head.y += 10;
      break;
    case "left":
      head.x -= 10;
      break;
    case "right":
      head.x += 10;
      break;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = getRandomPosition();
  } else {
    snake.pop();
  }

  if (checkCollision()) {
    isGameOver = true;
    clearInterval(intervalId);
    alert("Game Over! Your Score: " + score);
    restartButton.disabled = false;
  }

  snakeElement.innerHTML = "";
  drawSnake();
  drawFood();
}

document.addEventListener("keydown", (e) => {
  if (isGameStarted) {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
    }
  }
});

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    startButton.disabled = true;
    restartButton.disabled = true;
    slowDifficulty.disabled = true;
    mediumDifficulty.disabled = true;
    hardDifficulty.disabled = true;

    const selectedDifficulty = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value;

    switch (selectedDifficulty) {
      case "slow":
        speed = 120;
        break;
      case "medium":
        speed = 80;
        break;
      case "hard":
        speed = 50;
        break;
    }

    snake = [{ x: 150, y: 150 }];
    food = getRandomPosition();
    direction = "right";
    isGameOver = false;
    score = 0;
    snakeElement.innerHTML = "";
    drawSnake();
    drawFood();
    intervalId = setInterval(moveSnake, speed);
  }
}

function restartGame() {
  isGameStarted = false;
  startButton.disabled = false;
  restartButton.disabled = true;
  slowDifficulty.disabled = false;
  mediumDifficulty.disabled = false;
  hardDifficulty.disabled = false;
  snakeElement.innerHTML = "";
  clearInterval(intervalId);
}
