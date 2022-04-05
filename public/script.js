const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const start = document.querySelector('#start');
const lives = document.getElementById('lives');
const background = document.getElementById('background');
const scoreInfantryCurrent = document.querySelector('#score-infantry .current');
const scoreMachineryCurrent = document.querySelector('#score-machinery .current');
const scoreNavyCurrent = document.querySelector('#score-navy .current');
const scoreInfantryTotal = document.querySelector('#score-infantry .total');
const scoreMachineryTotal = document.querySelector('#score-machinery .total');
const scoreNavyTotal = document.querySelector('#score-navy .total');
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

let LEVEL = 0;
let ENEMIES_ARRAY = [];
const LEVELS = [0, 1, 2, 3, 4, 5];
const INFANTRY = 'infantry';
const MACHINERY = 'machinery';
const NAVY = 'navy';

const ENEMIES = {
  [INFANTRY]: {
    classes: ['soldier'],
    number: 0
  },
  [MACHINERY]: {
    classes: ['tank'],
    number: 0
  },
  [NAVY]: {
    classes: [],
    number: 0
  }
};
const SCORE = {
  [INFANTRY]: {
    current: scoreInfantryCurrent,
    total: scoreInfantryTotal
  },
  [MACHINERY]: {
    current: scoreMachineryCurrent,
    total: scoreMachineryTotal
  },
  [NAVY]: {
    current: scoreNavyCurrent,
    total: scoreNavyTotal
  }
};

const CONFIG = {
  LEVELS: {
    [LEVELS[0]]: {
      backgrounds: 'url(images/backgrounds/bg-level2.png) repeat-x center bottom #D6E1F5',
      birds: 'url(images/birds/duck-fly.gif)',
      enemies: {
        [INFANTRY]: {
          title: 'soldier',
          url: 'soldier.gif',
          number: 10,
          boom: 'boom.gif'
        },
        [MACHINERY]: {
          title: 'tank',
          url: 'tank.png',
          number: 5,
          boom: 'boom-2.gif'
        }
      },
      weapons: `url('images/weapons/poop.png') transparent no-repeat`
    },
    [LEVELS[1]]: {
      backgrounds: 'url(images/backgrounds/bg-level3.png) repeat-x center bottom #181B1E',
      birds: 'url(images/birds/duck-fly.gif)',
      enemies: {
        [INFANTRY]: {
          title: 'soldier',
          url: 'soldier.gif',
          number: 20,
          boom: 'boom.gif'
        },
        [MACHINERY]: {
          title: 'tank',
          url: 'tank.png',
          number: 10,
          boom: 'boom-2.gif'
        }
      },
      weapons: `url('images/weapons/poop.png') transparent no-repeat`
    }
  }
};

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

  background.style.background=CONFIG.LEVELS[LEVELS[LEVEL]].backgrounds;
  bird.style.background=CONFIG.LEVELS[LEVELS[LEVEL]].birds;

  const infantryTitle = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].title;
  const infantryNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number;
  const machineryTitle = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].title;
  const machineryNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number;
  // const navyTitle = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[NAVY].title;
  // const navyNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[NAVY].number;

  ENEMIES_ARRAY = [];
  ENEMIES_ARRAY.push(
    ...Array(infantryNumber + 1).fill(infantryTitle),
    ...Array(machineryNumber + 1).fill(machineryTitle),
    // ...Array(navyNumber + 1).fill(navyTitle),
  );
  ENEMIES_ARRAY = shuffle(ENEMIES_ARRAY);

  SCORE[INFANTRY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number);
  SCORE[MACHINERY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number);
  // SCORE[NAVY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[NAVY].number);

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
  const [enemyType, ...enemyTypes] = ENEMIES_ARRAY;
  ENEMIES_ARRAY = enemyTypes;
  return enemyType;
};

const createBullet = () => {
  let bullet = document.createElement('div');
  bullet.className = 'bullet';

  bullet.style.background = CONFIG.LEVELS[LEVELS[LEVEL]].weapons;

  bullet.style.top = bird.offsetTop + 150 + 'px';
  bullet.style.left = bird.offsetLeft + 50 + 'px';

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
    bullet.remove();
    enemy.remove();

    Object.keys(ENEMIES).forEach((key) => {
      if (ENEMIES[key].classes.includes(enemy.classList[1])) {
        ENEMIES[key].number += 1;
        SCORE[key].current.innerText = Number(SCORE[key].current.innerText) + 1;
      }
    });
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
  scoreBlock.innerText = ENEMIES[INFANTRY].number + ENEMIES[MACHINERY].number + ENEMIES[NAVY].number;

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
const shuffle = (array) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
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
