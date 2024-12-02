const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-infield-card"),
        computer: document.getElementById("computer-infield-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Water",
        img: `${pathImages}dragon.png`,
        winOf: [2],
        loseOf: [1],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Light",
        img: `${pathImages}magician.png`,
        winOf: [0],
        loseOf: [2],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Fire",
        img: `${pathImages}exodia.png`,
        winOf: [1],
        loseOf: [0],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return randomIndex;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(parseInt(cardImage.getAttribute("data-id")));
        });
    }

    cardImage.addEventListener("mouseover", () => {
        drawSelectCard(IdCard);
    });

    return cardImage;
}

async function setCardsField(CardId) {
    await removeAllCardsImages();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.innerHTML = "";
    const playerCard = cardData[CardId];
    const playerImage = document.createElement("img");
    playerImage.setAttribute("src", playerCard.img);
    playerImage.setAttribute("height", "150px");
    state.fieldCards.player.appendChild(playerImage);

    const computerCardId = await getRandomCardId();
    state.fieldCards.computer.innerHTML = "";
    const computerCard = cardData[computerCardId];
    const computerImage = document.createElement("img");
    computerImage.setAttribute("src", computerCard.img);
    computerImage.setAttribute("height", "150px");
    state.fieldCards.computer.appendChild(computerImage);

    const duelResults = await determineWinner(playerCard, computerCard);
    await updateScore();
    await drawButton(duelResults);

    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function removeAllCardsImages() {
    document.getElementById(playerSides.computer).innerHTML = "";
    document.getElementById(playerSides.player1).innerHTML = "";
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
}

async function determineWinner(playerCard, computerCard) {
    let result = "";
    if (playerCard.winOf.includes(computerCard.id)) {
        result = "Win";
        await playAudio("result");
        state.score.playerScore++;
    } else if (playerCard.loseOf.includes(computerCard.id)) {
        result = "Lose";
        await playAudio("result");
        state.score.computerScore++;
    } else {
        result = "Draw!";
    }
    return result;
}

async function drawButton(text) {
    state.actions.button.innerText = "Next Duel";
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function displayAllCards() {
    const playerCards = document.getElementById(playerSides.player1).querySelectorAll("img");
    const computerCards = document.getElementById(playerSides.computer).querySelectorAll("img");

    console.log("Player Cards:");
    playerCards.forEach((card) => console.log(card.getAttribute("data-id")));

    console.log("Computer Cards:");
    computerCards.forEach((card) => console.log(card.getAttribute("data-id")));
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    await removeAllCardsImages();
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer); // Cartas do computador serão geradas mas ocultas.
}

// Adiciona evento ao botão para reiniciar o duelo
state.actions.button.addEventListener("click", resetDuel);

init();




