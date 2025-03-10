"use strict"

const PACMAN = "😀"
var gPacman

function createPacman(board) {
  gPacman = {
    location: {
      i: 7,
      j: 7,
    },
    isSuper: false,
  }
  gFoodCount--
  board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
  if (!gGame.isOn) return

  // use getNextLocation(), nextCell
  var nextLocation = getNextLocation(ev)
  if (!nextLocation) return
  // console.log('nextLocation:', nextLocation)

  var nextCell = gBoard[nextLocation.i][nextLocation.j]
  // console.log('nextCell:', nextCell)

  // return if cannot move
  if (nextCell === WALL) return

  // hitting ghost? call gameOver
  if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      removeGhost(gPacman.location)
      playEatGhostSound()
    } else {
      playDeathSound()
      gameOver()
      return
    }
  }

  // hitting food? update score
  if (nextCell === FOOD) {
    gFoodCount--
    playEatingSound()
    updateScore(1)
    console.log("Food Left:", gFoodCount)
  }
  
  if (nextCell === CHERRY) {
    playEatingFruitSound() 
    updateScore(10)
  }

  if (nextCell === SUPER) {
    if (gPacman.isSuper) return
    superPower()
    setTimeout(() => {
      endSuperPower()
    }, 5000)
  }

  // win if pacman eat all food
  if (gFoodCount === 0) {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        if (gBoard[i][j] === FOOD) {
          console.log("Game not over yet")
        }
      }
    }
    console.log("Victory! no food around")
    victory()
    return
  }

  // moving from current location:
  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

  // update the DOM
  renderCell(gPacman.location, EMPTY)

  // Move the pacman to new location:
  // update the model
  gPacman.location = nextLocation
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

  // update the DOM
  renderCell(gPacman.location, PACMAN)
}

function getNextLocation(eventKeyboard) {
  // console.log('eventKeyboard.key:', eventKeyboard.key)
  // console.log('eventKeyboard.code:', eventKeyboard.code)

  // figure out nextLocation
  var nextLocation = {
    i: gPacman.location.i, // 7
    j: gPacman.location.j, // 7
  }

  switch (eventKeyboard.key) {
    case "ArrowUp":
      nextLocation.i--
      break
    case "ArrowDown":
      nextLocation.i++
      break
    case "ArrowRight":
      nextLocation.j++
      break
    case "ArrowLeft":
      nextLocation.j--
      break

    default:
      return null
  }

  return nextLocation
}

function superPower() {
  gPacman.isSuper = true
  changeGhostColor()
  playIntermissionSound()
}

function endSuperPower() {
  gPacman.isSuper = false

  for (var i = 0; i < gGhosts.length; i++) {
    gGhosts[i].color = getRandomColor()
  }
}
