window.onload = () => {
  const btnWrap = document.querySelectorAll('.logo-and-btn-wrap button');
  const divWrap = document.querySelectorAll('.logo-and-btn-wrap div');
  btnWrap.forEach((bw) => bw.classList.remove('loading'));
  divWrap.forEach((dw) => dw.classList.add('loading'));

  const backgroundStart = document.getElementById('background-start');

  const btnStart = document.querySelector('.btn-start');
  const btnAbout = document.querySelector('.btn-about');
  const facebookBtn = document.querySelectorAll('.facebookBtn');
  const telegramBtn = document.querySelectorAll('.telegramBtn');
  const btnHelp = document.querySelectorAll('.btn-help');
  const homeBtn = document.querySelectorAll('.home-link');

  const aboutBlock = document.querySelector('#about');
  const aboutCloseBtn = document.querySelector('#about-close');
  const startBlock = document.querySelector('#start');
  const startBtn = document.getElementById('startBtn');

  const nextLevelBlock = document.querySelector('#next-level');
  const nextLevelBtn = document.getElementById('nextLevelBtn');

  const previousLevelBlock = document.querySelector('#previous-level');
  const previousLevelBtn = document.getElementById('previousLevelBtn');

  const endBlockSuccess = document.querySelector('#end-success');
  const endBlockFail = document.querySelector('#end-fail');
  const restartBtn = document.getElementById('restartBtn');

  const background = document.getElementById('background');
  const levelIcon = document.querySelector('.levelIcon');
  const lives = document.getElementById('lives');
  const infantry = document.querySelector('#score-infantry');
  const machinery = document.querySelector('#score-machinery');
  const airforce = document.querySelector('#score-airforce');
  const putin = document.querySelector('#score-putin');

  const scoreInfantryCurrent = document.querySelector('#score-infantry .current');
  const scoreMachineryCurrent = document.querySelector('#score-machinery .current');
  const scoreAirforceCurrent = document.querySelector('#score-airforce .current');
  const scorePutinCurrent = document.querySelector('#score-putin .current');
  const scorePutinWrap = document.querySelector('.currentWrap');
  const scoreInfantryTotal = document.querySelector('#score-infantry .total');
  const scoreMachineryTotal = document.querySelector('#score-machinery .total');
  const scoreAirforceTotal = document.querySelector('#score-airforce .total');
  const gameBlock = document.querySelector('#game');
  const soundBtn = document.querySelector('#sound img');
  const bird = document.querySelector('#bird');
  const duck = document.querySelector('#duck');

  const music = document.querySelector('.music');
  const source = document.querySelector('.music source');

  const duckSound = document.querySelector('.duck-sound');
  const duckSoundSource = document.querySelector('.duck-sound source');

  const boomSound = document.querySelector('.boom-sound');
  const boomSoundSource = document.querySelector('.boom-sound source');

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

  const LINK_APP = 'https://birds-attack.web.app/';
  const TEXT_APP = 'Birds Attack 2022. Не дай рашистам пройти поряд. Знешкоджуй загарбників, покращуй озброєння, доберися до бункера.';
  const LINK_BANK = 'https://bank.gov.ua/ua/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi';
  const LINK_FACEBOOK = `https://www.facebook.com/sharer/sharer.php?u=${LINK_APP}`;
  const LINK_TELEGRAM = `https://t.me/share/url?url=${LINK_APP}&text=${TEXT_APP}`;

  const LINK_MUSIC = 'https://freesound.org/data/previews/210/210751_1556689-lq.mp3';

  const bulletInterval = 500;
  let bulletTimestamp = Date.now();
  let gameStarted = false;

  let birdSkin = 'duck';
  let countLives = 3;

  let sound = 'on';

  let LEVEL = 0;
  let ENEMIES_ARRAY = [];
  const LEVELS = [0, 1, 2, 3, 4, 5];
  let PUTIN_LIVES = 100;
  const INFANTRY = 'infantry';
  const MACHINERY = 'machinery';
  const AIRFORCE = 'airforce';
  const PUTIN = 'putin';

  const ENEMIES = {
    [INFANTRY]: {
      classes: ['infantry'],
      number: 0,
    },
    [MACHINERY]: {
      classes: ['machinery'],
      number: 0,
    },
    [AIRFORCE]: {
      classes: ['airforce'],
      number: 0,
    },
  };
  const SCORE = {
    [INFANTRY]: {
      current: scoreInfantryCurrent,
      total: scoreInfantryTotal,
    },
    [MACHINERY]: {
      current: scoreMachineryCurrent,
      total: scoreMachineryTotal,
    },
    [AIRFORCE]: {
      current: scoreAirforceCurrent,
      total: scoreAirforceTotal,
    },
  };

  const CONFIG = {
    LEVELS: {
      [LEVELS[0]]: {
        backgroundClass: 'bg-level-1',
        birdClass: 'duck-fly-1',
        enemies: {
          [INFANTRY]: {
            className: 'infantry-1',
            number: 5,
            boomClass: 'boom-1',
            boomSound: './audio/booms/Gunfire%20And%20Voices.mp3',
          },
          [MACHINERY]: {
            className: 'machinery-1',
            number: 5,
            boomClass: 'boom-2',
            boomSound: './audio/booms/Big%20Explosion%20Cut%20Off.mp3',
          },
          [AIRFORCE]: {
            className: 'airforce-1',
            number: 5,
            boomClass: 'boom-3',
            boomSound: './audio/booms/Magnum%20Shots%20-%20single.mp3',
          },
        },
        weaponClass: 'weapon-1',
      },
      [LEVELS[1]]: {
        backgroundClass: 'bg-level-2',
        birdClass: 'duck-fly-2',
        enemies: {
          [INFANTRY]: {
            className: 'infantry-2',
            number: 10,
            boomClass: 'boom-1',
            boomSound: './audio/booms/Gunfire%20And%20Voices.mp3',
          },
          [MACHINERY]: {
            className: 'machinery-2',
            number: 10,
            boomClass: 'boom-2',
            boomSound: './audio/booms/Big%20Explosion%20Cut%20Off.mp3',
          },
          [AIRFORCE]: {
            className: 'airforce-2',
            number: 10,
            boomClass: 'boom-3',
            boomSound: './audio/booms/Magnum%20Shots%20-%20single.mp3',
          },
        },
        weaponClass: 'weapon-2',
      },
      [LEVELS[2]]: {
        backgroundClass: 'bg-level-3',
        birdClass: 'duck-fly-3',
        enemies: {
          [INFANTRY]: {
            className: 'infantry-3',
            number: 15,
            boomClass: 'boom-1',
            boomSound: './audio/booms/Gunfire%20And%20Voices.mp3',
          },
          [MACHINERY]: {
            className: 'machinery-3',
            number: 15,
            boomClass: 'boom-2',
            boomSound: './audio/booms/Big%20Explosion%20Cut%20Off.mp3',
          },
          [AIRFORCE]: {
            className: 'airforce-3',
            number: 15,
            boomClass: 'boom-3',
            boomSound: './audio/booms/Magnum%20Shots%20-%20single.mp3',
          },
        },
        weaponClass: 'weapon-3',
      },
      [LEVELS[3]]: {
        backgroundClass: 'bg-level-4',
        birdClass: 'duck-fly-4',
        enemies: {
          [INFANTRY]: {
            className: 'infantry-4',
            number: 20,
            boomClass: 'boom-1',
            boomSound: './audio/booms/Gunfire%20And%20Voices.mp3',
          },
          [MACHINERY]: {
            className: 'machinery-4',
            number: 20,
            boomClass: 'boom-2',
            boomSound: './audio/booms/Big%20Explosion%20Cut%20Off.mp3',
          },
          [AIRFORCE]: {
            className: 'airforce-4',
            number: 20,
            boomClass: 'boom-3',
            boomSound: './audio/booms/Magnum%20Shots%20-%20single.mp3',
          },
        },
        weaponClass: 'weapon-4',
      },
      [LEVELS[4]]: {
        backgroundClass: 'bg-level-5',
        birdClass: 'duck-fly-5',
        enemies: {
          [INFANTRY]: {
            className: 'infantry-5',
            number: 25,
            boomClass: 'boom-1',
            boomSound: './audio/booms/Gunfire%20And%20Voices.mp3',
          },
          [MACHINERY]: {
            className: 'machinery-5',
            number: 25,
            boomClass: 'boom-2',
            boomSound: './audio/booms/Big%20Explosion%20Cut%20Off.mp3',
          },
          [AIRFORCE]: {
            className: 'airforce-5',
            number: 25,
            boomClass: 'boom-3',
            boomSound: './audio/booms/Magnum%20Shots%20-%20single.mp3',
          },
        },
        weaponClass: 'weapon-5',
      },
      [LEVELS[5]]: {
        backgroundClass: 'bg-level-6',
        birdClass: 'duck-fly-6',
        enemies: {
          [INFANTRY]: {
            className: 'putin',
            number: 10,
            boomClass: 'boom-1',
            boomSound: './audio/booms/Gunfire%20And%20Voices.mp3',
          },
          [MACHINERY]: {
            className: 'putin',
            number: 10,
            boomClass: 'boom-2',
            boomSound: './audio/booms/Big%20Explosion%20Cut%20Off.mp3',
          },
          [AIRFORCE]: {
            className: 'putin',
            number: 10,
            boomClass: 'boom-3',
            boomSound: './audio/booms/Magnum%20Shots%20-%20single.mp3',
          },
        },
        weaponClass: 'weapon-6',
      },
    },
  };

  const createDuckSoundLoop = () => {
    setTimeout(() => {
      if (gameStarted) {
        duckSound.play();
        createDuckSoundLoop();
      }
    }, random(20000, 25000));
  };

  const createEnemyLoop = (level) => {
    setTimeout(() => {
      if (gameStarted && ENEMIES_ARRAY.length && level === LEVEL) {
        createEnemy();
        createEnemyLoop(level);
      }
    }, random(1000 - LEVEL * 100, 5000 - LEVEL * 1000));
  };

  const startGame = () => {
    startBlock.style.display = 'none';
    endBlockFail.style.display = 'none';
    endBlockSuccess.style.display = 'none';
    gameBlock.style.display = 'block';
    putin.style.display = 'none';
    infantry.style.display = 'block';
    machinery.style.display = 'block';
    airforce.style.display = 'block';

    duckSound.load();
    duckSound.play();
    if (sound === 'on') music.play();

    background.className = '';
    background.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].backgroundClass);

    levelIcon.src = `./images/icons/level${LEVEL + 1}.png`;

    bird.className = '';
    bird.className = birdSkin;
    bird.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].birdClass);

    const infantryNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number;
    const machineryNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number;
    const airforceNumber = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[AIRFORCE].number;

    ENEMIES_ARRAY = [];
    ENEMIES_ARRAY.push(...Array(infantryNumber).fill(INFANTRY), ...Array(machineryNumber).fill(MACHINERY), ...Array(airforceNumber).fill(AIRFORCE));
    ENEMIES_ARRAY = shuffle(ENEMIES_ARRAY);
    ENEMIES_ARRAY.push(...shuffle([...Array(2).fill(INFANTRY), ...Array(2).fill(MACHINERY), ...Array(2).fill(AIRFORCE)]));

    SCORE[INFANTRY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number);
    SCORE[MACHINERY].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number);
    SCORE[AIRFORCE].total.innerHTML = String(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[AIRFORCE].number);

    createLives();
    createEnemyLoop(LEVEL);
    createDuckSoundLoop();

    gameStarted = true;
  };

  const putinStartGame = () => {
    startBlock.style.display = 'none';
    endBlockFail.style.display = 'none';
    endBlockSuccess.style.display = 'none';
    gameBlock.style.display = 'block';
    putin.style.display = 'block';
    infantry.style.display = 'none';
    machinery.style.display = 'none';
    airforce.style.display = 'none';

    duckSound.load();
    duckSound.play();
    if (sound === 'on') music.play();

    background.className = '';
    background.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].backgroundClass);

    levelIcon.src = `./images/icons/level${LEVEL + 1}.png`;

    bird.className = '';
    bird.className = birdSkin;
    bird.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].birdClass);

    scorePutinCurrent.innerHTML = String(PUTIN_LIVES);

    createLives();
    putinCreateEnemy();
    createDuckSoundLoop();

    gameStarted = true;
  };

  const moveEnemy = (enemy) => {
    let timerId = setInterval(() => {
      enemy.style.left = enemy.offsetLeft - (10 + LEVEL) + 'px';
      if (enemy.offsetLeft < -100) {
        enemy.remove();
        clearInterval(timerId);
        miss();
      }
    }, 30);
  };

  const putinMoveEnemy = (enemy) => {
    const clientWidth = Number(String(document.querySelector('body').clientWidth).replace('px', ''));

    const goLeft = () => {
      enemy.classList.add('putinLeft');
      enemy.classList.remove('putinRight');
      const randomNumber = random(100, -30);
      let moveLeft = setInterval(() => {
        enemy.style.left = enemy.offsetLeft - 12 + 'px';
        if (enemy.offsetLeft <= randomNumber * 10) {
          clearInterval(moveLeft);
          goRight();
        }
      }, 30);
    };

    const goRight = () => {
      enemy.classList.add('putinRight');
      enemy.classList.remove('putinLeft');
      const randomNumber = random(100, 300);
      let moveRight = setInterval(() => {
        enemy.style.left = enemy.offsetLeft + 35 + 'px';
        if (enemy.offsetLeft > clientWidth + randomNumber) {
          clearInterval(moveRight);
          goLeft();
        }
      }, 30);
    };

    enemy.style.left = clientWidth + 300 + 'px';
    goLeft();
  };

  const moveBullet = (bullet) => {
    let timerId = setInterval(() => {
      bullet.style.top = bullet.offsetTop + 10 + 'px';
      if (bullet.offsetTop > document.querySelector('body').clientHeight) {
        bullet.remove();
        clearInterval(timerId);
      }
      isBoom(bullet);
    }, 10);
  };

  const typeEnemy = () => {
    const [enemyType, ...enemyTypes] = ENEMIES_ARRAY;
    ENEMIES_ARRAY = enemyTypes;
    return enemyType;
  };

  const createEnemy = () => {
    let enemy = document.createElement('div');
    const type = typeEnemy();
    enemy.className = `enemy ${type} ${CONFIG.LEVELS[LEVELS[LEVEL]].enemies[type].className}`;

    gameBlock.appendChild(enemy);
    moveEnemy(enemy);
  };

  const putinCreateEnemy = () => {
    let enemy = document.createElement('div');
    enemy.className = `enemy ${PUTIN} putinLeft`;

    gameBlock.appendChild(enemy);
    putinMoveEnemy(enemy);
  };

  const createBullet = () => {
    let bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.top = bird.offsetTop + (bird.offsetTop > 100 ? 150 : 75) + 'px';
    bullet.style.left = bird.offsetLeft + (bird.offsetTop > 100 ? 50 : 20) + 'px';
    bullet.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].weaponClass);

    gameBlock.appendChild(bullet);
    moveBullet(bullet);
  };

  const isBoom = (bullet) => {
    let enemy = document.querySelector('.enemy');
    if (
      enemy &&
      bullet.offsetLeft > enemy.offsetLeft &&
      bullet.offsetLeft < enemy.offsetLeft + enemy.clientWidth &&
      bullet.offsetTop > enemy.offsetTop
    ) {
      const enemyClass = enemy.classList[1]; // 'enemy infantry'

      if (enemyClass === PUTIN) {
        createBoom(bullet.offsetTop, bullet.offsetLeft, MACHINERY);
        bullet.remove();
        enemy.classList.add('jumpUp');
        setTimeout(() => enemy.classList.remove('jumpUp'), 500);
        PUTIN_LIVES -= 2;
        scorePutinCurrent.innerHTML = String(PUTIN_LIVES);
        scorePutinWrap.style.width = `${PUTIN_LIVES}%`;
        if (PUTIN_LIVES === 0) {
          enemy.remove();
          endGameSuccess();
        }
      } else {
        createBoom(enemy.offsetTop, enemy.offsetLeft, enemyClass);
        bullet.remove();
        enemy.remove();

        Object.keys(ENEMIES).forEach((key) => {
          if (ENEMIES[key].classes.includes(enemyClass)) {
            ENEMIES[key].number += 1;
            SCORE[key].current.innerText = Number(SCORE[key].current.innerText) + 1;
          }
        });

        if (
          ENEMIES[INFANTRY].number >= CONFIG.LEVELS[LEVELS[LEVEL]].enemies[INFANTRY].number &&
          ENEMIES[MACHINERY].number >= CONFIG.LEVELS[LEVELS[LEVEL]].enemies[MACHINERY].number &&
          ENEMIES[AIRFORCE].number >= CONFIG.LEVELS[LEVELS[LEVEL]].enemies[AIRFORCE].number
        ) {
          endLevelNext();
        }
      }
    }
  };

  const miss = () => {
    countLives -= 1;
    if (countLives <= 0) {
      if (LEVEL === 0) {
        endGame();
      } else {
        endLevelPrevious();
      }
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
    boom.style.left = left + 'px';
    boom.classList.add(CONFIG.LEVELS[LEVELS[LEVEL]].enemies[enemyClass].boomClass);
    boomSoundSource.src = CONFIG.LEVELS[LEVELS[LEVEL]].enemies[enemyClass].boomSound;
    boomSound.load();
    boomSound.play();
    gameBlock.appendChild(boom);
    setTimeout(() => {
      boom.remove();
    }, 1000);
  };

  const endLevelNext = () => {
    gameStarted = false;
    ENEMIES_ARRAY = [];
    document.querySelectorAll('.enemy').forEach((e) => e.remove());

    nextLevelBlock.style.display = 'block';

    nextLevelBtn.onclick = startNextLevel;
  };

  const startNextLevel = () => {
    nextLevelBlock.style.display = 'none';
    LEVEL += 1;
    resetLives();
    resetScore();
    document.querySelector('body').requestFullscreen();
    LEVEL === LEVELS[LEVELS.length - 1] ? putinStartGame() : startGame();
  };

  const endLevelPrevious = () => {
    gameStarted = false;
    ENEMIES_ARRAY = [];
    document.querySelectorAll('.enemy').forEach((e) => e.remove());

    previousLevelBlock.style.display = 'block';

    previousLevelBtn.onclick = startPreviousLevel;
  };

  const startPreviousLevel = () => {
    previousLevelBlock.style.display = 'none';
    LEVEL -= 1;
    resetLives();
    resetScore();
    document.querySelector('body').requestFullscreen();
    LEVEL === LEVELS[LEVELS.length - 1] ? putinStartGame() : startGame();
  };

  const resetScore = () => {
    ENEMIES[INFANTRY].number = 0;
    ENEMIES[MACHINERY].number = 0;
    ENEMIES[AIRFORCE].number = 0;
    SCORE[INFANTRY].current.innerText = '0';
    SCORE[MACHINERY].current.innerText = '0';
    SCORE[AIRFORCE].current.innerText = '0';
  };

  const resetLives = () => {
    countLives = 3;
  };

  const endGame = () => {
    gameStarted = false;
    ENEMIES_ARRAY = [];
    LEVEL = 0;

    resetLives();
    resetScore();
    document.querySelectorAll('.enemy').forEach((e) => e.remove());

    endBlockFail.style.display = 'block';
  };

  const endGameSuccess = () => {
    gameStarted = false;
    ENEMIES_ARRAY = [];
    LEVEL = 0;

    endBlockSuccess.style.display = 'block';
  };

  startBtn.onclick = () => {
    LEVEL === LEVELS[LEVELS.length - 1] ? putinStartGame() : startGame();
    document.querySelector('body').requestFullscreen();
  };
  restartBtn.onclick = () => {
    LEVEL === LEVELS[LEVELS.length - 1] ? putinStartGame() : startGame();
    document.querySelector('body').requestFullscreen();
  };

  btnStart.onclick = () => {
    backgroundStart.style.display = 'none';
    background.style.setProperty('display', 'block', 'important');
    startBlock.style.display = 'block';
  };

  btnAbout.onclick = () => {
    aboutBlock.style.display = 'block';
  };

  facebookBtn.forEach((fb) => {
    fb.onclick = () => {
      window.open(LINK_FACEBOOK, '_blank');
    };
  });

  telegramBtn.forEach((fb) => {
    fb.onclick = () => {
      window.open(LINK_TELEGRAM, '_blank');
    };
  });

  aboutCloseBtn.onclick = () => {
    aboutBlock.style.display = 'none';
  };

  btnHelp.forEach((bh) => {
    bh.onclick = () => {
      window.open(LINK_BANK, '_blank');
    };
  });

  homeBtn.forEach((bh) => {
    bh.onclick = () => {
      location.reload();
    };
  });

  bird.onclick = () => {
    duckSound.play();
  };

  duck.onclick = () => {
    duck.className = 'selected';
    birdSkin = 'duck';
  };

  source.src = LINK_MUSIC;
  music.load();
  music.addEventListener('ended', () => {
    music.pause();
    music.load();
    music.play();
  });

  soundBtn.onclick = () => {
    if (sound === 'on') {
      soundBtn.src = 'images/icons/sound-off.png';
      sound = 'off';
      music.pause();
    } else {
      soundBtn.src = 'images/icons/sound-on.png';
      sound = 'on';
      music.play();
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
};
