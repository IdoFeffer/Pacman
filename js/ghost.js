"use strict"

const GHOST_IMAGES = [
  "img/blue-ghost.png",
  "img/red-ghost.png",
  "img/green-ghost.png",
]
const SUPER_GHOST_IMG = "img/yellow-ghost.png"
const GHOST = "&#9781;"

var gGhosts
var gIntervalGhosts
var deletedGhost

function createGhost(board) {
  if (gGhosts.length >= GHOST_IMAGES.length) return

  var ghost = {
    location: { i: 3, j: 3 },
    currCellContent: FOOD,
    imgSrc: GHOST_IMAGES[gGhosts.length],
  }
  gGhosts.push(ghost)
  board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
  // empty the gGhosts array, create 3 ghosts
  gGhosts = []

  for (var i = 0; i < 3; i++) {
    createGhost(board)
  }

  console.log("gGhosts:", gGhosts)
  // run the interval to move them
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
  // console.log('move')
  // loop through ghosts
  for (var i = 0; i < gGhosts.length; i++) {
    const ghost = gGhosts[i]
    // console.log('ghost:', ghost)
    moveGhost(ghost)
  }
}

function moveGhost(ghost) {
  // console.log('ghost:', ghost)
  // TODO: figure out moveDiff, nextLocation, nextCell
  var moveDiff = getMoveDiff()
  // console.log('moveDiff:', moveDiff)

  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  // console.log('nextLocation:', nextLocation)

  var nextCell = gBoard[nextLocation.i][nextLocation.j]
  // console.log('nextCell:', nextCell)

  // return if cannot move
  if (nextCell === WALL) return
  if (nextCell === GHOST) return
  if (nextCell === SUPER) return
  // hitting a pacman? call gameOver
  if (nextCell === PACMAN) {
    gameOver()
    return
  }

  // moving from current location (restore prev cell contents):
  // update the model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

  // update the DOM
  renderCell(ghost.location, ghost.currCellContent)

  // Move the ghost to new location (save cell contents):
  // update the model
  ghost.location = nextLocation
  ghost.currCellContent = nextCell

  gBoard[ghost.location.i][ghost.location.j] = GHOST

  // update the DOM
  renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4)

  switch (randNum) {
    case 1:
      return { i: 0, j: 1 }
    case 2:
      return { i: 1, j: 0 }
    case 3:
      return { i: 0, j: -1 }
    case 4:
      return { i: -1, j: 0 }
  }
}

function getGhostHTML(ghost) {
  return `<img src="${ghost.imgSrc}" alt="Ghost" style="height: 30px;">`;}

function changeGhostColor() {
  for (var i = 0; i < gGhosts.length; i++) {
    gGhosts[i].imgSrc = "img/yellow-ghost.png"
  }
}

function removeGhost(location) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (
      gGhosts[i].location.i === location.i &&
      gGhosts[i].location.j === location.j
    ) {
      deletedGhost.push(gGhosts[i])
      gGhosts.splice(gGhosts[i])
    }
  }
}
