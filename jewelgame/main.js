// sound
// bg : Games Worldbeat by Bernardo R.   // https://mixkit.co/free-stock-music/
// everything else by https://freesound.org/

const bg = document.querySelector('.bg');
const gg = document.querySelector('.bg .game-ground');

var ggWidth = 0;
var ggHeight = 0;

var carrotWidth = 30;
var carrotHeight = 30;

var bugWidth = 50;
var bugHeight = 50;

const minHeight = 0; // 57%
// const minHeight = 0.57; // 57%
const maxHeight = 1; // 100%

const minWidth = 0; //
const maxWidth = 1; //

let carrotCount = 0;
let bugCount = 0;

const timerDiv = document.querySelector('.timer');

const resultDiv = document.querySelector('.result');
const resultStr = document.querySelector('.result .msg');

var isPlaying = false;
const playBtnDiv = document.querySelector('.play-btn');
const playBtnElt = document.querySelector('.play-btn .fa-play');
const pauseBtnElt = document.querySelector('.play-btn .fa-stop');

const countElt = document.querySelector('.counter');

var totTimeSec = 0;
var timeMin = 0;
var timeSec = 0;

var timerInterval;
var level = 1;
const levelTextElt = document.querySelector('.level .level-txt');
const levelPopUpElt = document.querySelector('.level .level-popup');
const levelPopUpLineElt = document.querySelector('.level .line');

var catchSound;
var winSound;
var failSound;
var bgSound;

function calculateGGPosition() {
  const ggY0 = 0.62; // startY
  const ggY1 = 0.98;
  const ggX0 = 0.02;
  const ggX1 = 0.98;

  const bgHeight = bg.clientHeight; // in px or same unit as iconWidth
  const bgWidth = bg.clientWidth;
  console.log(`bgHeight: ${bgHeight}, bgWidth: ${bgWidth}`);
  ggHeight = bgHeight * (ggY1 - ggY0); // in px or same unit as iconWidth
  ggWidth = bgWidth * (ggX1 - ggX0);
  // ggHeight = gg.clientHeight * (ggY1 - ggY0); // in px or same unit as iconWidth
  // ggWidth = gg.clientWidth * (ggX1 - ggX0);
  console.log(`ggHeight: ${ggHeight}, ggWidth: ${ggWidth}`);

  gg.style.position = 'absolute';
  gg.style.width = ggWidth + 'px';
  gg.style.height = ggHeight + 'px';
  gg.style.left = bgWidth * ggX0 + 'px';
  gg.style.top = bgHeight * ggY0 + 'px';
}

function sound(src) {
  const audioElt = document.createElement('audio');
  audioElt.src = src;
  audioElt.setAttribute('preload', 'auto');
  audioElt.setAttribute('controls', 'none');
  audioElt.style.display = 'none';
  return document.body.appendChild(audioElt);

  // this.play = function() {
  //   this.sound.play();
  // };
  // this.stop = function() {
  //   this.sound.pause();
  // };
}

function soundInit() {
  const catchSoundSrc = './sound/success_jingle.wav';
  const winSoundSrc = './sound/win.wav';
  const failSoundSrc = './sound/game_die.mp3';
  const bgSoundSrc = './sound/bg.mp3';

  catchSound = sound(catchSoundSrc);
  failSound = sound(failSoundSrc);
  winSound = sound(winSoundSrc);
  bgSound = sound(bgSoundSrc);
}

function eventInit() {
  bg.addEventListener('click', (event) => {
    if (event.target.parentElement === null) {
      return;
    }
    if (
      event.target.parentElement.id != 'level' ||
      (event.target.parentElement.parentElement !== null &&
        event.target.parentElement.parentElement.id != 'level')
    ) {
      hideLevelBox();
    }
  });
  gg.addEventListener('click', (event) => {
    // console.log(`clicked target ${event.target}`);

    if (!isPlaying) {
      return;
    }
    if (event.target.hasAttribute('data-carrot')) {
      catchSound.currentTime = 0;
      catchSound.play();
      gg.removeChild(event.target);
      carrotCount--;
      console.log(`carrotCount: ${carrotCount}`);
      countElt.innerHTML = carrotCount;
      if (carrotCount == 0) {
        gameSuccess();
      }
      // event.target.parentNode.removeChild(event.target)
      // removeItem(event.target);
    } else if (event.target.hasAttribute('data-bug')) {
      // console.log(`${event.target.dataset.bug}`);
      gameFail();
      // showResult(event.target.dataset.bug);
    }
  });
}
function initialize() {
  calculateGGPosition();

  const carrotInitElt = document.querySelector('.carrot-init');
  carrotWidth = carrotInitElt.computedStyleMap().get('width').value; //35 70px
  carrotHeight = carrotInitElt.computedStyleMap().get('height').value;
  carrotInitElt.remove();

  const bugInitElt = document.querySelector('.bug-init');
  bugWidth = bugInitElt.computedStyleMap().get('width').value; //35 70px
  bugHeight = bugInitElt.computedStyleMap().get('height').value;
  bugInitElt.remove();

  soundInit();
  eventInit();
}

function getX(rand, iconWidth) {
  let x = rand * ggWidth;
  x = x - iconWidth;
  x = Math.max(x, 0); // for the corner cases when x = 0
  return x;
}

function getY(rand, iconHeight) {
  let y = rand * ggHeight;
  y = y - iconHeight;
  y = Math.max(y, 0);
  return y;
}

function getRand(min, max) {
  // [min, max)
  let rand = Math.random(); // 0.97; // [0,1)
  // console.log(`rand: ${rand}`);

  rand = (max - min) * rand + min;
  // console.log(`Random num ${rand}`);
  return rand;
}
function createCarrot() {
  let randX = getRand(minWidth, maxWidth);
  let randY = getRand(minHeight, maxHeight);
  // console.log(`(randX, randY) =(${randX}, ${randY})`);

  let x = getX(randX, carrotWidth); //in px
  let y = getY(randY, carrotHeight);
  // console.log(`(x,y) = (${x}, ${y})`);

  const carrotElt = document.createElement('img');
  carrotElt.setAttribute('src', 'img/carrot.png');
  carrotElt.setAttribute('class', 'carrot');
  carrotElt.setAttribute('data-carrot', '');
  carrotElt.style.left = x + 'px';
  carrotElt.style.top = y + 'px';

  //   carrotElt.addEventListener('click', event =>{

  //   });
  gg.appendChild(carrotElt);
}

function createBug() {
  let randX = getRand(minWidth, maxWidth);
  let randY = getRand(minHeight, maxHeight);
  // console.log(`(randX, randY) =(${randX}, ${randY})`);

  let x = getX(randX, bugWidth); //in px
  let y = getY(randY, bugHeight);
  // console.log(`(x,y) = (${x}, ${y})`);

  const bugElt = document.createElement('img');
  bugElt.setAttribute('src', 'img/bug.png');
  bugElt.setAttribute('class', 'bug');
  bugElt.setAttribute('data-bug', 'Game over!');
  bugElt.style.left = x + 'px';
  bugElt.style.top = y + 'px';

  gg.appendChild(bugElt);
}

function getRandInt(min, max) {
  //[min, max]
  // [3,7]
  // [0,4.999]  // [0,4]
  // const minInt = Math.floor(min);
  // const maxInt = Math.floor(max);
  let rand = Math.floor(Math.random() * (max - min + 1)) + min;
  // console.log(`rand: ${rand} with min max ${min}, ${max}`);
  return rand;
}
function setTimer(sec) {
  timeMin = Math.floor(sec / 60); // parseInt(sec)
  timeSec = sec - timeMin * 60;
  console.log(`min: ${timeMin} , sec: ${timeSec}`);
  var min = timeMin < 10 ? '0' + timeMin : timeMin;
  var sec = timeSec < 10 ? '0' + timeSec : timeSec;

  timerDiv.innerHTML = min + ':' + sec;
}
function startTimer() {
  totTimeSec--;
  if (totTimeSec == 0) {
    stopTimer();
    gameFail();
  }
  setTimer(totTimeSec);
}
function stopTimer() {
  clearInterval(timerInterval);
}

function playGame() {
  isPlaying = true;
  bgSound.play();
  startTimer();
  timerInterval = setInterval(startTimer, 1000);
}

function stopGame() {
  isPlaying = false;
  bgSound.pause();
  stopTimer();
}

function gameSuccess() {
  stopGame();
  winSound.play();
  showResult('YOU WON 🎉');
}

function gameFail() {
  stopGame();
  failSound.play();
  showResult('YOU LOST 💩');
}

function togglePlayBtn() {
  console.log(`toggle playbtnnnn ${isPlaying}`);
  if (isPlaying) {
    // want to stop
    pauseBtnElt.style.display = 'none';
    playBtnElt.style.display = 'block';
    stopGame();
  } else {
    //want to play
    playBtnElt.style.display = 'none';
    pauseBtnElt.style.display = 'block';
    playGame();
  }
}
function hideLevelBox() {
  levelPopUpElt.classList.remove('show');
  levelPopUpLineElt.classList.remove('show');
}
function toggleLevelBox() {
  levelPopUpElt.classList.toggle('show'); // .display = 'block';
  levelPopUpLineElt.classList.toggle('show');
}

function selectLevel(lev) {
  console.log(`level~~ ${lev}`);

  if (lev != level) {
    const prevLevElt = document.querySelector(`.level .level-popup .l${level}`);
    const newLevElt = document.querySelector(`.level .level-popup .l${lev}`);
    console.log(`prevlevel is ${level}`);
    console.log(`prevElt ${prevLevElt}`);
    prevLevElt.classList.remove('selected'); // .display = 'block';
    newLevElt.classList.add('selected');

    level = lev;
    levelTextElt.innerHTML = 'Level ' + level;
    gg.textContent = '';
    gameInit(level);
  }
}

function gameInit(level) {
  // level = 1; // [1,5]?
  carrotCount = getRandInt(5 * level, 7 * level);
  bugCount = getRandInt(5 * level, 6 * level);
  totTimeSec = Math.ceil((carrotCount * 1.5) / level);

  console.log(`------starting a game------`);
  console.log(
    `level: ${level}, ${carrotCount} carrots, ${bugCount} bugs, time: ${totTimeSec}`
  );
  countElt.innerHTML = carrotCount;
  isPlaying = false;
  pauseBtnElt.style.display = 'none';
  playBtnElt.style.display = 'block';
  levelTextElt.style.pointerEvents = 'auto';

  setTimer(totTimeSec);

  playBtnDiv.style.visibility = 'visible';

  for (let i = 0; i < bugCount; i++) {
    createBug();
  }
  for (let i = 0; i < carrotCount; i++) {
    createCarrot();
  }
}

function showResult(resStr) {
  resultDiv.style.display = 'flex';
  // resultDiv.style.display = 'block';
  playBtnDiv.style.visibility = 'hidden'; // display none doesn't take up space.
  levelTextElt.style.pointerEvents = 'none';

  resultStr.innerHTML = resStr;
}

function hideResult() {
  resultDiv.style.display = 'none';
}

function restartGame() {
  gg.textContent = ''; //https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  hideResult();
  failSound.pause();
  winSound.pause();
  bgSound.currentTime = 0;
  gameInit(level);
}

// draw bugs first and then carrots

document.addEventListener('DOMContentLoaded', function(event) {
  // your code here
  initialize();
  gameInit(level);
});
