const squares = document.querySelectorAll('.square');
const timer = document.querySelector('#time');
const points = document.querySelector('#points');
const button = document.querySelector('button');
const highScore = document.querySelector('#highScoreValue');
const audio = document.querySelector('#audio');
const music = document.querySelector('#music');
const wrongAudio = document.querySelector('#wrong');
const musicIcon = document.querySelector('#musicIcon');

let starPosition; 
let result;
let starInterval;
let timeLeft;
let countDownTimer;
let canClick = false;
let bestScore = 0; 


window.addEventListener('load', () => {

  music.loop = true;

  //function for turning music on and off
  //music is automatically off in case it's too loud for the player
  function startMusic() {
    music.play();
    musicIcon.classList.remove('music-off');
    document.removeEventListener('click', startMusic);
  }

  function stopMusic() {
    music.pause();
    musicIcon.classList.add('music-off');
  }
  
  //music can be turned on/off using icons
  musicIcon.addEventListener('click', () => {
    if (music.paused) {
      startMusic();
    } 
    else {
      stopMusic();
    }
  });

  stopMusic();
});

//picking random square for the star
function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('star');
  });

  const randomIndex = Math.floor(Math.random() * squares.length);
  const randomSquare = squares[randomIndex];
  randomSquare.classList.add('star'); //star appears on the square picked before
  starPosition = randomSquare.id;
  canClick = true;
}

//star changes position every 0.6 seconds
function changePosition() {
  clearInterval(starInterval);
  starInterval = setInterval(randomSquare, 600);
}

//starting the game after the player presses PLAY button
function startGame() {
  button.disabled = true; //disabling the PLAY button after starting the game
  button.classList.add('clicked');
  document.querySelector('body').classList.remove('win');
  document.querySelector('#board').classList.remove('win');

  //resetting variables
  result = 0;
  timeLeft = 60;
  points.textContent = result;
  timer.textContent = timeLeft;
  highScore.textContent = bestScore + "/50";
  clearInterval(starInterval);
  clearInterval(countDownTimer);
  randomSquare();
  changePosition();
  countDownTimer = setInterval(countDown, 1000);
  canClick = true;
}

//the main game mechanism
squares.forEach(square => {
  square.addEventListener('click', () => {
    if (canClick) { //it's impossible to click on squares and earn points before the game starts
      if (square.id == starPosition && canClick) {
        result++;
        points.textContent = result;
        canClick = false;  //stars can be clicked only once per appearing
        playSound(audio); //audio for clicking on correct square
      } 
      else {
        timer.textContent = timeLeft + '-3'; //substract 3 from the time if wrong square is clicked
        timeLeft = Math.max(0, timeLeft - 3);

        playSound(wrongAudio);
   
        square.classList.add('incorrect'); 
        setTimeout(() => {
          square.classList.remove('incorrect');
        }, 300); 
      }
      if (result > bestScore) { //updating best score
        bestScore = result;
        highScore.textContent = bestScore + "/50";
      }
      if (timeLeft === 0) { //lose condition called second time, bc -3 seconds aren't aren't included in countDown()
        endGame();
        alert('YOU LOSE :( FINAL SCORE: ' + result); 
      }
      if (result >= 50) { //win condition
        win();
        alert('YOU WIN :) FINAL SCORE: ' + result);
      }
    }
  });
});

//shows the remaining time
function countDown() {
  timeLeft--;
  timer.textContent = timeLeft;

  if (timeLeft === 0) {
    endGame();
    alert('YOU LOSE :( FINAL SCORE: ' + result);
  }
}

//ends the game
function endGame() {
  clearInterval(countDownTimer);
  clearInterval(starInterval);
  button.disabled = false;
  button.classList.remove('clicked');
  timer.textContent = '0';
}

//ends the game (win)
function win() {
  endGame();
  document.querySelector('body').classList.add('win');
  document.querySelector('#board').classList.add('win');
}

//plays the game sounds
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

//allows to change the volume of music and sounds
function changeMusicVolume(musicVolume) {
  music.volume = musicVolume;
}

function changeVolume(volume) {
  audio.currentTime = 0; 
  wrongAudio.volume = volume;
  audio.volume = volume;
  audio.play(); //odtworzenie dźwięku przy każdej zmianie, aby gracz wiedział, jak głośna będzie gra
}
//starts the game after pressing the PLAY button
button.addEventListener('click', startGame);
