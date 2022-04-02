const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const start = document.querySelector('#start');
const lives = document.getElementById('lives');
const score = document.querySelector('#score span');
const audio = document.querySelector('audio');
const gameBlock = document.querySelector('#game');
const soundBtn = document.querySelector('#sound img');
const bird = document.querySelector('#bird');
const duck = document.querySelector('#duck');
// const source = document.querySelector('audio source');

let sound = 'off';
let birdSkin = 'duck';
let countLives = 3;
let bulletTimestamp = Date.now();
const bulletInterval = 500;
let gameStarted = false;

startBtn.onclick = () => {
  startGame();
};
restartBtn.onclick = () => {
  startGame();
};

duck.onclick = () => {
  duck.className = 'selected';
  birdSkin = 'duck';
};

soundBtn.onclick = () => {
  if (sound === 'on') {
    soundBtn.src = 'images/sound-off.png';
    sound = 'off';
    audio.pause();
  } else {
    soundBtn.src = 'images/sound-on.png';
    sound = 'on';

    // source.src = 'audio/music.mp3';
    audio.load();
    audio.play();
  }
};

document.onkeydown = (e) => {
  if (gameStarted && e.keyCode === 32 && bulletTimestamp + bulletInterval < Date.now()) {
    bulletTimestamp = Date.now();
    createBullet();
  }
};

document.onclick = () => {
  if (gameStarted && bulletTimestamp + bulletInterval < Date.now()) {
    bulletTimestamp = Date.now();
    createBullet();
  }
};

document.ontouchstart = () => {
  if (gameStarted && bulletTimestamp + bulletInterval < Date.now()) {
    bulletTimestamp = Date.now();
    createBullet();
  }
};

function startGame() {
  start.style.display = 'none';
  gameBlock.style.display = 'block';
  bird.className = birdSkin;

  createEnemy();
  createLives();

  gameStarted = true;
}

function moveEnemy(enemy) {
  let timerId = setInterval(() => {
    enemy.style.left = enemy.offsetLeft - 10 + 'px';
    if (enemy.offsetLeft < -100) {
      enemy.remove();
      createEnemy();
      clearInterval(timerId);
      die();
    }
  }, 30);
}

function moveBullet(bullet) {
  let timerId = setInterval(() => {
    bullet.style.top = bullet.offsetTop + 10 + 'px';
    if (bullet.offsetTop > document.querySelector('body').clientHeight) {
      bullet.remove();
      clearInterval(timerId);
    }
    isBoom(bullet);
  }, 10);
}

function createEnemy() {
  let enemy = document.createElement('div');
  enemy.className = 'enemy ' + typeEnemy();
  enemy.style.top = document.querySelector('#app').clientHeight - 150 + 'px';

  gameBlock.appendChild(enemy);
  moveEnemy(enemy);
}

function typeEnemy() {
  if (random(1, 2) === 1) {
    return 'tank';
  } else {
    return 'tank';
  }
}

function createBullet() {
  let bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.top = bird.offsetTop + 140 + 'px';
  bullet.style.left = bird.offsetLeft + 70 + 'px';

  gameBlock.appendChild(bullet);
  moveBullet(bullet);
}

function isBoom(bullet) {
  let enemy = document.querySelector('.enemy');
  if (enemy && bullet.offsetLeft > enemy.offsetLeft && bullet.offsetLeft < enemy.offsetLeft + enemy.clientWidth && bullet.offsetTop > enemy.offsetTop) {
    createBoom(bullet.offsetTop, bullet.offsetLeft);
    score.innerText = Number(score.innerText) + 1;
    bullet.remove();
    enemy.remove();
    createEnemy();
  }
}

function die() {
  countLives -= 1;
  if (countLives <= 0) {
    endGame();
  }

  createLives();
}
function createLives() {
  lives.innerHTML = '';
  let count = 0;
  while (count < countLives) {
    let span = document.createElement('span');
    lives.appendChild(span);
    count += 1;
  }
}

function createBoom(top, left) {
  let boom = document.createElement('div');
  boom.className = 'boom';
  boom.style.top = top - 100 + 'px';
  boom.style.left = left - 100 + 'px';
  gameBlock.appendChild(boom);
  setTimeout(() => {
    boom.remove();
  }, 1000);
}

function endGame() {
  gameStarted = false;

  let scoreBlock = document.querySelector('#end h3 span');
  scoreBlock.innerText = score.innerText;

  gameBlock.innerHTML = '';
  let endBlock = document.querySelector('#end');
  endBlock.style.display = 'block';

  let restartBtn = document.querySelector('#end button');
  restartBtn.onclick = restart;
}

function restart() {
  location.reload();
}

function random(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
