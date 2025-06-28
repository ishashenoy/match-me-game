const gridContainer = document.querySelector(".grid-container");
const totalgameswonEl = document.querySelector(".totalgameswon");
const happy = new Audio("assets/sounds/happy.mp3");
const press = new Audio("assets/sounds/press.mp3");
const levelup = new Audio("assets/sounds/levelup.wav");
const bgm = new Audio("assets/sounds/coulditbemagic.mp3");
bgm.loop = true;

let cards = [];
let firstCard,secondCard;
let lockBoard = false;
let currentTheme = 'original';

let totalgameswon = 0;
totalgameswonEl.textContent = totalgameswon;
let score = 0;

cards = [1,2,3,4,1,2,3,4];
let scoreWin = cards.length/2;

shuffleCards();
generateCards('original');
addTheme("original");

function pauseOrPlay(){
    const playButton = document.getElementById('music-button');
    if (playButton.textContent ==='►'){
        bgm.play();
        playButton.textContent ='||';
    } else {
        bgm.pause();
        playButton.textContent ='►';
    }
}

// Fisher-Yates Shuffle algorithm
function shuffleCards(){
    let currentI = cards.length, randomI, temp;
    while(currentI !== 0){
        randomI = Math.floor(Math.random() * currentI);
        currentI--;
        temp = cards[currentI];
        cards[currentI] = cards[randomI];
        cards[randomI] = temp;
    }
}

function generateCards(themeName){
    for (let card of cards){
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-card-number", card);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src="assets/img/${themeName}/${card}.png">
            </div>
            <div class="back" style="background-image: url('assets/img/${themeName}/back.png');"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard(){
    if(lockBoard){
        return;
    } 
    if (this === firstCard){
        return;
    }
    press.play();
    this.classList.add("flipped");

    if(!firstCard){
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch(){
    let isMatch = firstCard.dataset.cardNumber === secondCard.dataset.cardNumber;
    if(isMatch){
        score++;
        disableCards();
        happy.play();
        if (score===scoreWin){
            score = 0;
            levelup.play();
            totalgameswon++;
            totalgameswonEl.textContent = totalgameswon;
            show('gamewon');
            if (totalgameswon===2){
                addTheme("food");
            }
        }
    } else{
        unflipCards();
    }
}

function disableCards(){
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

function unflipCards(){
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard(){
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart(){
    resetBoard();
    shuffleCards();
    gridContainer.innerHTML = "";
    generateCards(currentTheme);
}

function show(elmnt){
    let x = document.getElementById(elmnt);
    if (x.style.display === "none"){
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function addTheme(themeName){
    const themeElement = document.createElement("button");
    const thumb = document.createElement("img");
    thumb.src = `assets/img/${themeName}/thumb.png`;
    
    themeElement.innerText = themeName.toUpperCase();
    themeElement.appendChild(thumb);

    document.querySelector(".button-container").appendChild(themeElement);

    themeElement.addEventListener("click", function(){
        currentTheme = themeName;
        gridContainer.innerHTML = "";
        generateCards(themeName);
    });
}

function mode(gameMode){
    let board = document.querySelector(".grid-container");
    if (gameMode==="easy"){
        cards = [1,2,3,4,1,2,3,4];
        board.style.gridTemplateRows = "repeat(2,calc(80px/2*3));";
    } else if(gameMode==="hard"){
        cards = [1,2,3,4,5,6,1,2,3,4,5,6];
        board.style.gridTemplateRows = "repeat(3,calc(80px/2*3));"; 
    }
    scoreWin = cards.length/2;
    resetBoard();
    shuffleCards();
    gridContainer.innerHTML = "";
    generateCards(currentTheme);
}