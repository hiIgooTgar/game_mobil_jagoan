const score = document.getElementById("score");
const namaUser = document.getElementById("namaUser");
const startScreen = document.getElementById("startScreen");
const gameArea = document.getElementById("gameArea");
const user = document.getElementById("user");
const btnMulai = document.getElementById("btnMulai");
const levelGame = document.getElementById("levelGame");
const levelView = document.getElementById("levelView");

btnMulai.addEventListener("click", startGame);
let player = { speed: 5 };

levelGame.addEventListener("change", () => {
  if (levelGame.value == 1) {
    player.speed = 5;
  } else if (levelGame.value == 2) {
    player.speed = 6;
  } else if (levelGame.value == 3) {
    player.speed = 7;
  } else if (levelGame.value == 4) {
    player.speed = 9;
  }
});

window.addEventListener("input", () => {
  if (user.value.length > 0 && levelGame.value != 0) {
    btnMulai.disabled = false;
  } else {
    btnMulai.disabled = true;
  }
});

let keys = {
  F11: false,
  KeyA: false,
  KeyD: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function keyUp(e) {
  e.preventDefault();
  keys[e.code] = false;
}

function keyDown(e) {
  e.preventDefault();
  keys[e.code] = true;
}

function gamePlay() {
  let car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect();

  if (player.start) {
    moveLines();
    moveEnemyCar(car);

    if ((keys.ArrowLeft || keys.KeyA) && player.x > 0) {
      player.x -= player.speed;
    }

    if ((keys.ArrowRight || keys.KeyD) && player.x < road.width - 60) {
      player.x += player.speed;
    }

    car.style.left = `${player.x}px`;
    window.requestAnimationFrame(gamePlay);

    player.score += 5;
    score.innerHTML = "Score : " + player.score;
    let nama = user.value;
    namaUser.textContent = "Username : " + nama;
    var level = levelGame.options[levelGame.selectedIndex].text;
    levelView.textContent = "Level : " + level;
  }
}

function moveLines() {
  let lines = document.querySelectorAll(".line");
  lines.forEach((line, index) => {
    if (line.y >= 700) {
      line.y -= 750;
    }
    line.y += player.speed;
    line.style.top = line.y + "px";
  });
}

function isCollide(car, enemyCar) {
  carRect = car.getBoundingClientRect();
  enemyCarRect = enemyCar.getBoundingClientRect();

  return !(
    carRect.top > enemyCarRect.bottom ||
    carRect.left > enemyCarRect.right ||
    carRect.right < enemyCarRect.left ||
    carRect.bottom < enemyCarRect.top
  );
}

function moveEnemyCar(car) {
  let enemyCar = document.querySelectorAll(".enemyCar");
  enemyCar.forEach((enemyCar, index) => {
    if (isCollide(car, enemyCar)) {
      endGame();
    }

    if (enemyCar.y >= 750) {
      enemyCar.y = -300;
      enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    }

    enemyCar.y += player.speed;
    enemyCar.style.top = enemyCar.y + "px";
  });
}

function startGame() {
  namaUser.classList.remove("hide");
  score.classList.remove("hide");
  levelView.classList.remove("hide");
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";

  document.addEventListener("keyup", keyUp);
  document.addEventListener("keydown", keyDown);

  player.start = true;
  player.score = 0;
  window.requestAnimationFrame(gamePlay);

  for (let i = 0; i < 5; i++) {
    let roadLine = document.createElement("div");
    roadLine.setAttribute("class", "line");
    roadLine.y = i * 150;
    roadLine.style.top = roadLine.y + "px";
    gameArea.appendChild(roadLine);
  }

  let car = document.createElement("car");
  car.setAttribute("class", "car");

  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  for (let i = 0; i < 4; i++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemyCar");
    enemyCar.y = (i + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    randomEnemy = Math.floor(Math.random() * (9 - 0));
    enemyCar.style.backgroundImage = `url("./assets/images/enemy/enemy${randomEnemy}.png")`;
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    gameArea.appendChild(enemyCar);
  }
}

function quitgame() {
  window.location.reload();
}

function endGame() {
  let showLevel;
  if (levelGame.value == 1) {
    showLevel = "Easy";
  } else if (levelGame.value == 2) {
    showLevel = "Normal";
  } else if (levelGame.value == 3) {
    showLevel = "Hard";
  } else if (levelGame.value == 4) {
    showLevel = "Very Hard";
  }
  player.start = false;
  startScreen.classList.remove("hide");
  const gameOverScreen = document.createElement("section");
  gameOverScreen.id = "screenGameOver";
  gameOverScreen.innerHTML = `
  <main>
        <div class="content">
          <h1>Game Over</h1>
          <div class="detail">
            <h5>Username : ${user.value}</h5>
            <h5>Points : ${player.score}</h5>
            <h5>Level : ${showLevel}</h5>
          </div>
          <div class="btn-content">
            <button id="restratGame">Restart</button>
          </div>
        </div>
      </main>
  `;

  document.body.appendChild(gameOverScreen);
  gameOverScreen.addEventListener("click", quitgame);
}
