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

const bulletInterval = 500;
let bulletTimestamp = Date.now();
let gameStarted = false;

let birdSkin = 'duck';
let countLives = 3;

let sound = 'off';

const createEnemyLoop = () => {
  setTimeout(() => {
    if (gameStarted) {
      createEnemy();
      createEnemyLoop();
    }
  }, random(1000, 5000));
};

const startGame = () => {
  start.style.display = 'none';
  gameBlock.style.display = 'block';
  bird.className = birdSkin;

  createLives();
  createEnemyLoop();

  gameStarted = true;
};

const moveEnemy = enemy => {
  let timerId = setInterval(() => {
    enemy.style.left = enemy.offsetLeft - 10 + 'px';
    if (enemy.offsetLeft < -100) {
      enemy.remove();
      clearInterval(timerId);
      die();
    }
  }, 30);
};

const moveBullet = bullet => {
  let timerId = setInterval(() => {
    bullet.style.top = bullet.offsetTop + 10 + 'px';
    if (bullet.offsetTop > document.querySelector('body').clientHeight) {
      bullet.remove();
      clearInterval(timerId);
    }
    isBoom(bullet);
  }, 10);
};

const createEnemy = () => {
  let enemy = document.createElement('div');
  enemy.className = 'enemy ' + typeEnemy();
  enemy.style.top = document.querySelector('#app').clientHeight - 200 + 'px';

  gameBlock.appendChild(enemy);
  moveEnemy(enemy);
};

const typeEnemy = () => {
  if (random(1, 2) === 1) {
    return 'soldier';
  } else {
    return 'tank';
  }
};

const createBullet = () => {
  let bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.top = bird.offsetTop + 140 + 'px';
  bullet.style.left = bird.offsetLeft + 30 + 'px';

  gameBlock.appendChild(bullet);
  moveBullet(bullet);
};

const isBoom = bullet => {
  let enemy = document.querySelector('.enemy');
  if (
    enemy &&
    bullet.offsetLeft > enemy.offsetLeft &&
    bullet.offsetLeft < enemy.offsetLeft + enemy.clientWidth &&
    bullet.offsetTop > enemy.offsetTop
  ) {
    createBoom(bullet.offsetTop, bullet.offsetLeft);
    score.innerText = Number(score.innerText) + 1;
    bullet.remove();
    enemy.remove();
  }
};

const die = () => {
  countLives -= 1;
  if (countLives <= 0) {
    endGame();
  }

  createLives();
};
const createLives = () => {
  lives.innerHTML = '';
  let count = 0;
  while (count < countLives) {
    let span = document.createElement('span');
    lives.appendChild(span);
    count += 1;
  }
};

const createBoom = (top, left) => {
  let boom = document.createElement('div');
  boom.className = 'boom';
  boom.style.top = top - 100 + 'px';
  boom.style.left = left - 100 + 'px';
  gameBlock.appendChild(boom);
  setTimeout(() => {
    boom.remove();
  }, 1000);
};

const endGame = () => {
  gameStarted = false;

  let scoreBlock = document.querySelector('#end h3 span');
  scoreBlock.innerText = score.innerText;

  gameBlock.innerHTML = '';
  let endBlock = document.querySelector('#end');
  endBlock.style.display = 'block';

  let restartBtn = document.querySelector('#end button');
  restartBtn.onclick = restart;
};

const restart = () => {
  location.reload();
};

const random = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

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
  if (
    gameStarted &&
    e.keyCode === 32 &&
    bulletTimestamp + bulletInterval < Date.now()
  ) {
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
