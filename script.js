const squares = document.querySelectorAll('.square');
const timer = document.querySelector('#time');
const points = document.querySelector('#points');
const button = document.querySelector('button');
const highScore = document.querySelector('#highScoreValue');
const audio = document.querySelector('#audio');
const music = document.querySelector('#music');
const wrongAudio = document.querySelector('#wrong');

let starPosition; 
let result;
let starInterval;
let timeLeft;
let countDownTimer;
let canClick = false; //zmienna potrzebna, aby nie można było 2 razy kliknąć na tę samą gwiazdę
let bestScore = 0; 

//funkcja do włączania i wyłączania muzyki
//włącza się po załadowaniu strony, aby domyślnie muzyka mogła być wyłączona
window.addEventListener('load', () => {
  var music = document.querySelector('#music');
  var musicIcon = document.querySelector('#musicIcon');

  music.loop = true;

  function startMusic() {
    music.play();
    musicIcon.classList.remove('music-off');
    document.removeEventListener('click', startMusic);
  }

  function stopMusic() {
    music.pause();
    musicIcon.classList.add('music-off');
  }
  
  //dodanie funkcji włączania i wyłączania muzyki do specjalnej ikonki
  musicIcon.addEventListener('click', () => {
    if (music.paused) {
      startMusic();
    } 
    else {
      stopMusic();
    }
  });

  stopMusic(); //automatyczne wyłączenie muzyki, aby nie irytować gracza od razu po załadowaniu strony
});

//funkcja losująca, w którym miejscu pojawi się gwiazda
function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('star'); //resetowanie położenia gwiazdy
  });

  const randomIndex = Math.floor(Math.random() * squares.length);
  const randomSquare = squares[randomIndex];
  randomSquare.classList.add('star'); //pokazanie gwiazdy na wylosowanym kwadracie
  starPosition = randomSquare.id; //id wylosowanego kwadratu podstawiane jest pod zmienną położenia gwiazdy
  canClick = true;
}

//funkcja zmieniajaca polozenie gwiazdy co 0.6 sekundy
function changePosition() {
  clearInterval(starInterval);
  starInterval = setInterval(randomSquare, 600);
}

//definicja funkcji rozpoczęcia gry, która wywołana będzie kliknięciem guzika PLAY
function startGame() {
  button.disabled = true; //uniemożliwienie zaczęcia gry od nowa w jej trakcie
  button.classList.add('clicked');
  document.querySelector('body').classList.remove('win');
  document.querySelector('#board').classList.remove('win');

  //resetowanie zmiennych
  result = 0;
  timeLeft = 60;
  points.textContent = result;
  timer.textContent = timeLeft;
  highScore.textContent = bestScore + "/50"; //zwycięstwo oznacza koniec gry, więc max wynik może wynosić 50
  clearInterval(starInterval);
  clearInterval(countDownTimer);
  randomSquare();
  changePosition();
  countDownTimer = setInterval(countDown, 1000); //odliczanie minuty co 1 sekunde
  canClick = true;
}

//głowny mechanizm działania gry; punkty naliczają się, gdy gracz kliknie kwadrat z oznaczeniem
//pozycji gwiazdy i możliwością kliknięcia kwadratu uwarunkowaną w poprzednich funkcjach
squares.forEach(square => {
  square.addEventListener('click', () => {
    if (canClick) { //warunek rozpoczęcia całego mechanizmu, aby nie można było klikać na kwadraty przed rozpoczęciem gry
      if (square.id == starPosition && canClick) {
        result++;
        points.textContent = result;
        canClick = false;  //zapewnienie, że można kliknąć gwiazdę tylko raz
        playSound(audio); //dźwięk kliknięcia na poprawny kwadrat
      } 
      else {
        timer.textContent = timeLeft + '-3'; //odejmowanie 3 sekund w razie kliknięcia na zły kwadrat
        timeLeft = Math.max(0, timeLeft - 3); //zapewnienie, że czas nie spadnie poniżej 0 po odjęciu 3 sekund

        playSound(wrongAudio); //dźwięk kliknięcia na zły kwadrat
        //animacja w przypadku kliknięcia złego kwadratu
        square.classList.add('incorrect'); 
        setTimeout(() => { //odczekanie chwili przed usunięciem animacji
          square.classList.remove('incorrect');
        }, 300); 
      }
      if (result > bestScore) { //aktualizowanie najlepszego wyniku gracza
        bestScore = result;
        highScore.textContent = bestScore + "/50";
      }
      if (timeLeft === 0) { //warunek przegranej. musi być wywołany drugi raz, bo w countDown() nie uwzględnia się odejmowania 3 sekund
        endGame();
        alert('YOU LOSE :( FINAL SCORE: ' + result); 
      }
      if (result >= 50) { //warunek zwycięstwa
        win();
        alert('YOU WIN :) FINAL SCORE: ' + result);
      }
    }
  });
});

//funkcja wyświetlająca pozostały czas
function countDown() {
  timeLeft--;
  timer.textContent = timeLeft;
  //przegrana w razie zakończenia odliczania
  if (timeLeft === 0) {
    endGame();
    alert('YOU LOSE :( FINAL SCORE: ' + result);
  }
}

//funkcja konczaca grę
function endGame() {
  clearInterval(countDownTimer);
  clearInterval(starInterval);
  button.disabled = false;
  button.classList.remove('clicked');
  timer.textContent = '0';
}

//funkcja kończąca grę, ale w przypadku zwycięstwa
function win() {
  endGame();
  document.querySelector('body').classList.add('win');
  document.querySelector('#board').classList.add('win');
}

//funkcja do puszczania dźwięków gry
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}



//funkcje do zmiany głośności muzyki i dźwięków gry
function changeMusicVolume(musicVolume) {
  music.volume = musicVolume;
}

function changeVolume(volume) {
  audio.currentTime = 0; 
  wrongAudio.volume = volume;
  audio.volume = volume;
  audio.play(); //odtworzenie dźwięku przy każdej zmianie, aby gracz wiedział, jak głośna będzie gra
}
//wywołanie rozpoczęcia gry po kliknięciu przycisku PLAY
button.addEventListener('click', startGame);
