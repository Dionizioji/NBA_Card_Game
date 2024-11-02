let nameCards = [
    'images/Barkley.png', 'images/Carter.png', 'images/Curry.png',
    'images/Duncan.png', 'images/Iverson.png', 'images/Jordan.png',
    'images/Kawhi.png', 'images/Kobe.png', 'images/Lebron.png', 'images/Shaq.png'
]
let numberSorted = []
let usedNumbers = new Set()
let revealedCards = []
let currentPlayer = 1
let scores = { playerOne: 0, playerTwo: 0 }
let isProcessing = false
let totalPairs = 10
let gameActive = false
let matchedPairs = new Set()

function getUniqueRandomNumber() {
    let randomNumber
    do {
        randomNumber = Math.floor(Math.random() * 20) + 1
    } while (usedNumbers.has(randomNumber))
    usedNumbers.add(randomNumber)
    return randomNumber
}

function associateUniqueRandomNumbers(cards) {
    numberSorted = []
    usedNumbers.clear()
    matchedPairs.clear()
    cards.forEach(card => {
        let firstRandomNumber = getUniqueRandomNumber()
        let secondRandomNumber = getUniqueRandomNumber()
        numberSorted.push([card, firstRandomNumber])
        numberSorted.push([card, secondRandomNumber])
    })
}

function updateScore() {
    const gameControler = document.getElementById('starting-game')
    const inputPone = document.getElementById('player-one')
    const inputPtwo = document.getElementById('player-two')
    
    if (scores.playerOne + scores.playerTwo === totalPairs) {
        let winner, loser, winnerScore, loserScore
        if (scores.playerOne > scores.playerTwo) {
            winner = inputPone.value || 'Player One'
            loser = inputPtwo.value || 'Player Two'
            winnerScore = scores.playerOne
            loserScore = scores.playerTwo
        } else {
            winner = inputPtwo.value || 'Player Two'
            loser = inputPone.value || 'Player One'
            winnerScore = scores.playerTwo
            loserScore = scores.playerOne
        }
        
        gameControler.innerHTML = `${winner} VENCEU!`
        gameControler.style.backgroundColor = '#4CAF50'
        gameActive = false
        
        setTimeout(() => {
            alert(`Vencedor >>> ${winner} - ${winnerScore} pontos\n${loser} - ${loserScore} pontos`)
        }, 500)
    } else {
        gameControler.innerHTML = `Player One: ${scores.playerOne} X Player Two: ${scores.playerTwo}`
    }
}

function hideUnmatchedCards() {
    revealedCards.forEach(card => {
        if (!matchedPairs.has(card.id)) {
            card.setAttribute('src', 'images/figura_oculta.png')
        }
    })
    revealedCards = []
    isProcessing = false
}

function isCardMatched(cardId) {
    return matchedPairs.has(cardId)
}

function checkForMatch() {
    if (revealedCards.length === 2) {
        isProcessing = true
        const [firstCard, secondCard] = revealedCards
        
        if (firstCard.getAttribute('src') === secondCard.getAttribute('src')) {
            matchedPairs.add(firstCard.id)
            matchedPairs.add(secondCard.id)
            scores[currentPlayer === 1 ? 'playerOne' : 'playerTwo']++
            updateScore()
            revealedCards = []
            isProcessing = false
        } else {
            setTimeout(hideUnmatchedCards, 1000)
            currentPlayer = currentPlayer === 1 ? 2 : 1
        }
    }
}

function handleCardClick(element) {
    if (!gameActive || 
        isProcessing || 
        revealedCards.length >= 2 || 
        revealedCards.includes(element) || 
        isCardMatched(element.id)) {
        return
    }

    const cardId = parseInt(element.id)
    const matchedPair = numberSorted.find(([_, number]) => number === cardId)
    
    if (matchedPair) {
        element.setAttribute('src', matchedPair[0])
        revealedCards.push(element)
        checkForMatch()
    }
}

function controller() {
    const chosenCards = Array.from(document.getElementsByClassName('card'))
    chosenCards.forEach(element => {
        element.addEventListener('click', () => handleCardClick(element))
    })
}

function resetGame() {
    const chosenCards = document.querySelectorAll('.card')
    chosenCards.forEach(card => {
        card.setAttribute('src', 'images/figura_oculta.png')
    })
    
    revealedCards = []
    scores = { playerOne: 0, playerTwo: 0 }
    currentPlayer = 1
    isProcessing = false
    gameActive = false
    matchedPairs.clear()
}

const gameControler = document.getElementById('starting-game')
gameControler.addEventListener('click', (event) => {
    event.preventDefault()
    let inputPone = document.getElementById('player-one')
    let inputPtwo = document.getElementById('player-two')
    
    if (!gameActive) {
        resetGame()
        gameActive = true
        inputPone.setAttribute('disabled', true)
        inputPtwo.setAttribute('disabled', true)
        associateUniqueRandomNumbers(nameCards)
        updateScore()
        controller()
    } else {
        resetGame()
        inputPone.removeAttribute('disabled')
        inputPtwo.removeAttribute('disabled')
        gameControler.innerHTML = 'PLAY'
        gameControler.style.backgroundColor = 'var(--cor-primaria)'
    }
})