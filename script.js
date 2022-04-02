const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const start = document.querySelector('#start');
const lives = document.getElementById('lives');
const score = document.querySelector('#score span');
const player = document.querySelector('audio');
const gameBlock = document.querySelector('#game');
const soundBtn = document.querySelector('#sound img');
const gamer = document.querySelector('#player');
// const source = document.querySelector('audio source');

let gamerSkin = 'duck';
let countLives = 3;

startBtn.onclick = () => {
  startGame();
};
restartBtn.onclick = () => {
  startGame();
};

let sound = 'off';

soundBtn.onclick = () => {
  if (sound === 'on') {
    soundBtn.src = 'images/sound-off.png';
    sound = 'off';
    player.pause();
  } else {
    soundBtn.src = 'images/sound-on.png';
    sound = 'on';

    // source.src = 'audio/music.mp3';
    player.load();
    player.play();
  }
};

document.onkeydown = (e) => {
  // moveGamer(gamer)
  console.dir(e);
  if (e.keyCode === 37) {
    gamer.style.left = gamer.offsetLeft - 40 + 'px';
    gamer.classList.add('left');
    gamer.classList.remove('right');
  }
  if (e.keyCode === 39) {
    gamer.style.left = gamer.offsetLeft + 40 + 'px';
    gamer.classList.remove('left');
    gamer.classList.add('right');
  }
  if (e.keyCode === 32) {
    createBullet();
  }
};

function startGame() {
  start.style.display = 'none';
  gameBlock.style.display = 'block';
  gamer.className = gamerSkin;

  createEnemy();
  createLifes();
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
  let timer = setInterval(() => {
    bullet.style.top = bullet.offsetTop + 10 + 'px';
    if (bullet.offsetTop > document.querySelector('body').clientHeight) {
      bullet.remove();
      clearInterval(timer);
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
  bullet.style.top = gamer.offsetTop + 140 + 'px';
  bullet.style.left = gamer.offsetLeft + 70 + 'px';

  gameBlock.appendChild(bullet);
  moveBullet(bullet);
}

function isBoom(bullet) {
  let enemy = document.querySelector('.enemy');
  if (bullet.offsetLeft > enemy.offsetLeft && bullet.offsetLeft < enemy.offsetLeft + enemy.clientWidth && bullet.offsetTop > enemy.offsetTop) {
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

  createLifes();
}
function createLifes() {
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

const selectSkin1 = document.querySelector('#duck');
selectSkin1.onclick = () => {
  selectSkin1.className = 'selected';
  selectSkin2.className = '';
  gamerSkin = 'duck';
};
