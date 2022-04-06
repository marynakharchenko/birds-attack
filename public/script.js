const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const start = document.querySelector('#start');
const lives = document.getElementById('lives');
const background = document.getElementById('background');
const scoreInfantryCurrent = document.querySelector('#score-infantry .current');
const scoreMachineryCurrent = document.querySelector('#score-machinery .current');
const scoreAirforceCurrent = document.querySelector('#score-airforce .current');
const scoreInfantryTotal = document.querySelector('#score-infantry .total');
const scoreMachineryTotal = document.querySelector('#score-machinery .total');
const scoreAirforceTotal = document.querySelector('#score-airforce .total');
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

let LEVEL = 1;
let ENEMIES_ARRAY = [];
const LEVELS = [0, 1, 2, 3, 4, 5];
const INFANTRY = 'infantry';
const MACHINERY = 'machinery';
const AIRFORCE = 'airforce';

const ENEMIES = {
  [INFANTRY]: {
    classes: ['infantry'],
    number: 0
  },
  [MACHINERY]: {
    classes: ['machinery'],
    number: 0
  },
  [AIRFORCE]: {
    classes: ['airforce'],
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
  [AIRFORCE]: {
    current: scoreAirforceCurrent,
    total: scoreAirforceTotal
  }
};

const CONFIG = {
  LEVELS: {
    [LEVELS[0]]: {
      backgroundClass: 'bg-level-1',
      birdClass: 'duck-fly-1',
      enemies: {
        [INFANTRY]: {
          className: 'infantry',
          number: 10,
          boomClass: 'boom-1'
        },
        [MACHINERY]: {
          className: 'machinery',
          number: 5,
          boomClass: 'boom-2'
        },
        [AIRFORCE]: {
          className: 'airforce',
          number: 5,
          boomClass: 'boom-3'
        }
      },
      weaponClass: 'weapon-1'
    },
    [LEVELS[1]]: {
      backgroundClass: 'bg-level-2',
      birdClass: 'duck-fly-2',
      enemies: {
        [INFANTRY]: {
          className: 'infantry',
          number: 20,
          boomClass: 'boom-1'
        },
        [MACHINERY]: {
          className: 'machinery',
          number: 10,
          boomClass: 'boom-2'
        },
        [AIRFORCE]: {
          className: 'airforce',
          number: 10,
          boomClass: 'boom-3'
        }
      },
      weaponClass: 'weapon-2'
    }
  }
};

const createEnemyLoop = () => {
  setTimeout(() => {
    if (gameStarted && ENEMIES_ARRAY.length) {
      createEnemy();
      createEnemyLoop();
    }
  }, random(1000, 5000));
};

const startGame = () => {
  start.style.display = 'none';
  gameBlock.style.display = 'block';

  background.className = '';
  background.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].backgroundClass);

  bird.className = '';
  bird.className = birdSkin;
  bird.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].birdClass);

  const infantryClass = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].className;
  const infantryNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number;
  const machineryClass = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].className;
  const machineryNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number;
  const airforceClass = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[AIRFORCE].className;
  const airforceNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[AIRFORCE].number;

  ENEMIES_ARRAY = [];
  ENEMIES_ARRAY.push(
    ...Array(infantryNumber).fill(infantryClass),
    ...Array(machineryNumber).fill(machineryClass),
    ...Array(airforceNumber).fill(airforceClass),
  );
  ENEMIES_ARRAY = shuffle(ENEMIES_ARRAY);
  ENEMIES_ARRAY.push(...shuffle([...Array(2).fill(infantryClass), ...Array(2).fill(machineryClass), ...Array(2).fill(airforceClass)]));

  SCORE[INFANTRY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number);
  SCORE[MACHINERY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number);
  SCORE[AIRFORCE].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[AIRFORCE].number);

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
  bullet.style.top = bird.offsetTop + 150 + 'px';
  bullet.style.left = bird.offsetLeft + 50 + 'px';
  bullet.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].weaponClass);

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
    const enemyClass = enemy.classList[1]; // 'enemy infantry'

    createBoom(bullet.offsetTop, bullet.offsetLeft, enemyClass);
    bullet.remove();
    enemy.remove();

    Object.keys(ENEMIES).forEach((key) => {
      if (ENEMIES[key].classes.includes(enemyClass)) {
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

const createBoom = (top, left, enemyClass) => {
  let boom = document.createElement('div');
  boom.className = 'boom';
  boom.style.top = top - 100 + 'px';
  boom.style.left = left - 100 + 'px';
  boom.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[enemyClass].boomClass);
  gameBlock.appendChild(boom);
  setTimeout(() => {
    boom.remove();
  }, 1000);
};

const endGame = () => {
  gameStarted = false;

  let scoreBlock = document.querySelector('#end h3 span');
  scoreBlock.innerText = ENEMIES[INFANTRY].number + ENEMIES[MACHINERY].number + ENEMIES[AIRFORCE].number;

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
