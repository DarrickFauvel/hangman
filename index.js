import { words as animalNames } from './words/animal.js'
import { words as computerTerms } from './words/computer.js'

// Define element targets
const categoryForm = document.getElementById('category-form')
const categorySelect = document.getElementById('category-select')
const gameContainer = document.getElementById('game-container')
const wordEl = document.getElementById('word')
const selectedWordEl = document.getElementById('selected-word')
const wrongLettersEl = document.getElementById('wrong-letters')
const playBtn = document.getElementById('play-button')
const popup = document.getElementById('popup-container')
const notification = document.getElementById('notification-container')
const finalMessage = document.getElementById('final-message')
const figureParts = document.querySelectorAll('.figure-part')

// Define audio objects
const audioSuccess = new Audio('./audio/511484__mattleschuck__success-bell.wav')
const audioFail = new Audio('./audio/483598__raclure__wrong.mp3')
const audioWin = new Audio(
  './audio/274180__littlerobotsoundfactory__jingle-win-synth-00.wav'
)

// Set variables
let words = []
let selectedWord = ''
const correctLetters = []
const wrongLetters = []

// Get random word from word list
const getRandomWord = () => {
  const randomWord = words[Math.floor(Math.random() * words.length)]
  return randomWord
}

const selectCategory = (e) => {
  e.preventDefault()
  categorySelect.blur()

  const selectedCategory = categorySelect.value

  if (selectedCategory === 'computer terms') {
    words = [...computerTerms]
  } else if (selectedCategory === 'animal names') {
    words = [...animalNames]
  } else {
    return
  }

  // Lowercase words
  words = words.map((word) => word.toLowerCase())

  selectedWord = getRandomWord()

  displayWord()

  // Keydown letter press
  window.addEventListener('keydown', (e) => {
    // console.log(e.keyCode)
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key

      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter)

          displayWord()
        } else {
          showNotification()
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter)

          updateWrongLettersEl()
        } else {
          showNotification()
        }
      }
    }
  })
}

// Show hidden word
const displayWord = () => {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ''}
        </span>
      `
      )
      .join('')}
  `
  const innerWord = wordEl.innerText.replace(/\n/g, '')

  if (innerWord === selectedWord) {
    audioWin.play()
    finalMessage.innerText = 'Congratulations! You won! 😃🎉'
    popup.style.display = 'flex'
    playBtn.focus()
  }
}

// Update the wrong letters
const updateWrongLettersEl = () => {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join(' ')}
  `

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length

    index < errors
      ? (part.style.display = 'block')
      : (part.style.display = 'none')
  })

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    audioFail.play()

    finalMessage.innerText = 'Unfortunately you lost. 😧'
    popup.style.display = 'flex'
    playBtn.focus()
    showSelectedWord()
  }
}

// Show notification
const showNotification = () => {
  notification.classList.add('show')

  setTimeout(() => {
    notification.classList.remove('show')
  }, 2000)
}

// Show selected word
const showSelectedWord = () => {
  selectedWordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) => `
        <span class="letter">
          ${letter}
        </span>
      `
      )
      .join('')}
  `
  const innerWord = selectedWordEl.innerText.replace(/\n/g, '')
}

// Restart game and play again
playBtn.addEventListener('click', () => {
  // Empty arrays
  correctLetters.splice(0)
  wrongLetters.splice(0)
  selectedWordEl.innerHTML = ''

  selectedWord = getRandomWord()

  displayWord()

  updateWrongLettersEl()

  popup.style.display = 'none'
})

categorySelect.addEventListener('change', selectCategory)
