"use strict"

const WALL = "#"
const FOOD = "."
const EMPTY = " "
const SUPER = "🍫"
const CHERRY = "🍒"

const gGame = {
  score: 0,
  isOn: false,
}

var gBoard
var gFoodCount = 0
var gCherryIntreval

function onInit() {
  gBoard = buildBoard()

  createPacman(gBoard)
  createGhosts(gBoard)
  setInterval(addCherry, 2000)
  renderBoard(gBoard)
  gGame.isOn = true
}

function buildBoard() {
  const size = 10
  const board = []
  gFoodCount = 0

  for (var i = 0; i < size; i++) {
    board.push([])

    for (var j = 0; j < size; j++) {
      board[i][j] = FOOD
      gFoodCount++

      if (
        i === 0 ||
        i === size - 1 ||
        j === 0 ||
        j === size - 1 ||
        (j === 3 && i > 4 && i < size - 2)
      ) {
        board[i][j] = WALL
        gFoodCount--
      }
      if (
        (i === 1 && j === 1) ||
        (i === 1 && j === 8) ||
        (i === 8 && j === 1) ||
        (i === 8 && j === 8)
      ) {
        board[i][j] = SUPER
        gFoodCount--
      }
    }
  }

  // console.log('board:', board)
  console.table(board)
  return board
}

function renderBoard(board) {
  var strHTML = ""
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>"
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">
                            ${cell}
                    </td>`
    }
    strHTML += "</tr>"
  }
  const elContainer = document.querySelector(".board")
  elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function updateScore(diff) {
  // update both the model and the dom for the score
  gGame.score += diff
  document.querySelector("h2 span").innerText = gGame.score
}

function onRestart() {
  var elGameOver = document.querySelector(".restart")
  var elRestartScore = document.querySelector("h2 span")
  elRestartScore.innerHTML = 0
  elGameOver.style.display = "none"
  elGameOver.innerHTML = ""
  onInit()
}

function gameOver() {
  console.log("Game Over")
  gGame.isOn = false
  renderCell(gPacman.location, EMPTY)
  clearInterval(gIntervalGhosts)

  // openModal
  var elGameOver = document.querySelector(".restart")
  elGameOver.innerHTML += `
    <h2 class="lose-message" style="color: green">You died! Play Again</h2>
    <button class="victory-button" onclick="onRestart()()">Start Over</button>
    `
  elGameOver.style.display = "block"
}

function victory() {
  gGame.isOn = false
  clearInterval(gIntervalGhosts)

  var elGameWin = document.querySelector(".restart")
  elGameWin.innerHTML = `
    <h2 class="victory-message" style="color: gold">🎉 You Won! 🎉</h2>
    <button class="victory-button" onclick="onRestart()">Play Again</button>
`
  elGameWin.style.display = "block"
}

function addCherry() {
  var emptyCell = getEmptyCell()

  if (!emptyCell) {
    console.log("Skipping cherry - no empty cells available!")
    return
  }

  gBoard[emptyCell.i][emptyCell.j] = CHERRY
  renderCell(emptyCell, CHERRY)
  setTimeout(() => {
    if (gBoard[emptyCell.i][emptyCell.j] === CHERRY) {
      gBoard[emptyCell.i][emptyCell.j] = FOOD
      renderCell(emptyCell, "")
    }
  }, 15000)
}
