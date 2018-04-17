let rootStyles, rootSize, size, sizeUnit, rootWidth, rootHeight
let localStorage
// elements du DOM
let playground, tiles, faces
// le DOM virtuel
let zone

init()
function init() {

  // go chercher les variables CSS
  getCssVar()
  function getCssVar() {
    rootStyles = getComputedStyle(document.querySelector(':root'))
    
    // et les convertit en variable JS (c'est un peu inutile mais bon c cool a savoir)
    rootSize = rootStyles.getPropertyValue('--size').trim();
    size = parseInt(rootSize)
    sizeUnit = rootSize.replace(size, '')
    
    rootWidth = rootStyles.getPropertyValue('--width')
    rootHeight = rootStyles.getPropertyValue('--height')
  }

  initLocalStorage()  
  function initLocalStorage() {
    try {
      localStorage = window.localStorage.getItem('bloc')
      if (!localStorage) {
        // disposition des blocs par default
        localStorage = '[{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":0},{"x":0,"y":1},{"x":0,"y":2},{"x":1,"y":2},{"x":3,"y":0},{"x":2,"y":1},{"x":2,"y":2},{"x":0,"y":4},{"x":1,"y":4},{"x":2,"y":4},{"x":3,"y":4},{"x":0,"y":6},{"x":1,"y":6},{"x":0,"y":5},{"x":2,"y":5},{"x":3,"y":6},{"x":0,"y":8},{"x":1,"y":8},{"x":2,"y":8},{"x":3,"y":8},{"x":3,"y":9},{"x":3,"y":10},{"x":1,"y":9},{"x":0,"y":10},{"x":0,"y":9},{"x":0,"y":12},{"x":0,"y":13},{"x":0,"y":14},{"x":3,"y":14},{"x":3,"y":12},{"x":2,"y":14},{"x":3,"y":13},{"x":1,"y":12},{"x":1,"y":13},{"x":0,"y":16},{"x":0,"y":17},{"x":0,"y":18},{"x":1,"y":16},{"x":1,"y":17},{"x":3,"y":18},{"x":3,"y":16},{"x":3,"y":17},{"x":2,"y":18},{"x":5,"y":0},{"x":5,"y":1},{"x":5,"y":2},{"x":6,"y":0},{"x":7,"y":0},{"x":7,"y":1},{"x":8,"y":2},{"x":8,"y":0},{"x":7,"y":2},{"x":6,"y":2},{"x":5,"y":4},{"x":6,"y":4},{"x":7,"y":4},{"x":8,"y":4},{"x":8,"y":5},{"x":8,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":5,"y":9},{"x":5,"y":13},{"x":5,"y":14},{"x":5,"y":15},{"x":6,"y":14},{"x":7,"y":14},{"x":8,"y":14},{"x":5,"y":17},{"x":5,"y":18},{"x":5,"y":19},{"x":6,"y":17},{"x":8,"y":17},{"x":7,"y":17},{"x":8,"y":19},{"x":8,"y":18},{"x":7,"y":19},{"x":6,"y":19},{"x":10,"y":0},{"x":10,"y":1},{"x":10,"y":2},{"x":11,"y":0},{"x":12,"y":0},{"x":13,"y":0},{"x":13,"y":1},{"x":13,"y":2},{"x":11,"y":1},{"x":11,"y":4},{"x":12,"y":4},{"x":10,"y":4},{"x":13,"y":4},{"x":13,"y":5},{"x":12,"y":6},{"x":11,"y":6},{"x":10,"y":5},{"x":10,"y":8},{"x":10,"y":9},{"x":10,"y":10},{"x":11,"y":9},{"x":12,"y":9},{"x":13,"y":8},{"x":13,"y":9},{"x":13,"y":10},{"x":6,"y":8},{"x":7,"y":8},{"x":8,"y":8},{"x":10,"y":12},{"x":10,"y":13},{"x":10,"y":14},{"x":11,"y":13},{"x":12,"y":13},{"x":13,"y":13},{"x":16,"y":19},{"x":17,"y":19},{"x":18,"y":19},{"x":19,"y":18},{"x":15,"y":19},{"x":14,"y":18},{"x":15,"y":16},{"x":15,"y":15},{"x":18,"y":15},{"x":18,"y":16}]'
        window.localStorage.setItem('bloc', localStorage)
      }
    }catch (error) {
      // ca marche pas sur safari :(
      document.body.innerHTML = "Sorry, it doesn't seem to work there. <br> Try it on another browser !"
    }
  }


  // ! on initialise le dom virtuel
  initZone()
  function initZone() {
    // lui c le dom virtuel (je crois que ca s'appelle comme ca)
    zone = []
    for (let i = 0; i < rootHeight; i++) {
      let line = []
      for (let j = 0; j < rootWidth; j++) {
        line.push({
          x: j,
          y: i,
          p: '',
          // met `true` ou `false` en allant voir dans le localStorage
          b: localStorage.indexOf(`{"x":${j},"y":${i}}`) !== -1,
          move: null
        })
      }
      zone.push(line)
    }
  }

  // ! le premier Render (on creer les tuiles et on rajoute les blocs gris)
  initRender()
  function initRender() {
    playground = document.querySelector('.playground')  
    playground.innerHTML = ""
    for (let i = 0; i < zone.length; i++) {
      for (let j = 0; j < zone[i].length; j++) {
        
        let tile = document.createElement('div')
        tile.className = 'tile'

        tile.style.top = (size*j) + sizeUnit
        tile.style.left = (size*i) + sizeUnit

        tile.innerHTML = `<div class="face top"></div> <div class="face frontLeft"></div> <div class="face frontRight"></div> <div class="face bottom"></div> <div class="face backRight"></div> <div class="face backLeft"></div>`
      
        tile.dataset.info = JSON.stringify({x: j, y: i})
        
        if (zone[i][j].b) {
          tile.classList.add('cube', 'bloc')
        }

        playground.appendChild(tile)
      }
    }
    tiles = document.querySelectorAll('.tile')
    faces = document.querySelectorAll('.face')  
  }

}

// ! les petits gens, on les met dans un tableau
const p = [
  new Player('p0', randPos('p0'), {pv: 10, atk: 3, steps: 4}),
  new Player('p1', randPos('p1'), {pv: 10, atk: 2, steps: 4}),
  new Player('p2', randPos('p2'), {pv: 10, atk: 2, steps: 4}),
  new Player('p3', randPos('p3'), {pv: 10, atk: 2, steps: 4}),
]

// `z` il stocke c le tour de qui
let z = 0

updateZone(false, true)

// ! dedans y'a tous les trucs liés au joueurs
function Player (name, pos, stats) {
  // les infos
  this.name = name
  this.pos = {
    x: pos.x,
    y: pos.y
  }
  this.stats = {
    pv: stats.pv,
    atk: stats.atk,
    steps: stats.steps
  }

  // rajoute un `p` dans le dom virtuel
  this.updatePos = function () {
    zone[this.pos.y][this.pos.x].p = this.name
  }

  // cherche les differents chemins possible
  this.pathFinder = function () {
    this.pathTry(this.pos, {x: +1, y: 0}, this.stats.steps, [])
    this.pathTry(this.pos, {x: -1, y: 0}, this.stats.steps, [])
    this.pathTry(this.pos, {x: 0, y: +1}, this.stats.steps, [])
    this.pathTry(this.pos, {x: 0, y: -1}, this.stats.steps, [])
  }

  // il essaye un chemin (postion actuelle, direction, pas restants, chemin actuel)
  this.pathTry = function(now, next, remaining, path) {

    // [X] si t'a utilisé tous tes pas
    if (remaining===0) {
      return
    }

    // sa postion suivante
    let there = {
      x: now.x + next.x,
      y: now.y + next.y
    }

    // [X] si la case elle existe pas
    if (!zone[there.y] || !zone[there.y][there.x]) {
      return
    }
    // [X] si y'a un mur
    if (zone[there.y][there.x].b) {
      return
    }
    // [X] si y'a deja qqn
    if (zone[there.y][there.x].p) {
      return
    }
    
    // c bon tu peux passer woulou

    // on fait un copie du tableau (parce que les tableaux ca marche par reference, et si on le fait pas ba ca fait des trucs bizar)
    let therePath = path.slice()

    // on ajoute dans le chemin, la case actuelle
    therePath.push(there)

    // si c le moins long, on le push dans le dom virtuel
    if (!zone[there.y][there.x].move || zone[there.y][there.x].move.length >= therePath.length) {
      zone[there.y][there.x].move = therePath
    }

    // on reessaye dans les 4 directions
    // le %2 c pour qu'il marche en diagonale (il fait des zigzags)
    if (remaining%2 !== 0) { 
      // on donne sa postion actuelle, la direction, ses pas restants, et son chemin actuel
      this.pathTry(there, {x: +1, y: 0}, remaining-1, therePath)
      this.pathTry(there, {x: -1, y: 0}, remaining-1, therePath)
      this.pathTry(there, {x: 0, y: +1}, remaining-1, therePath)
      this.pathTry(there, {x: 0, y: -1}, remaining-1, therePath)
    } else {
      this.pathTry(there, {x: 0, y: +1}, remaining-1, therePath)
      this.pathTry(there, {x: 0, y: -1}, remaining-1, therePath)
      this.pathTry(there, {x: +1, y: 0}, remaining-1, therePath)
      this.pathTry(there, {x: -1, y: 0}, remaining-1, therePath)
    }
  }

  // c quqnd tu clique sur une case colorée ca fait ca
  this.move = function (event) {

    let there = JSON.parse(event.target.dataset.info)
    // on recupere les infos, on lui donne le chemin a prendre
    this.animMove(there.move, 0)

  }.bind(this) 
  // le bind(this) c pour dire que dans animMove, `this` c le joueur et pas window

  this.animMove = function (path, i) {

    // lorsqu'on est arrivé, on re updateZone, mais en lui disant que l'animation est terminee
    if (!path[i]) {
      updateZone(false)
      return
    }

    // on update la position du joueur
    this.pos.x = path[i].x
    this.pos.y = path[i].y
    // on update le dom virtuel et le dom
    updateZone(true)

    // 0,4s apres, on refait la meme
    window.setTimeout(() => { this.animMove(path, i+1) }, 400)
  }
}

// ! fait avancer le jeu
function updateZone(anim, first, wasediting) {

  if (!first) {
    // enleve les `p` et les `move` du dom virtuel
    clearZone()
    // enleve les classes, les ecouteurs et les datasets du dom
    clearRender()
  }

  // passe au prochain joueur
  !first && !anim && !wasediting && nextPlayer()
  
  // remet tout le monde dans le dom virtuel
  for (let i = 0; i < p.length; i++) {
    p[i].updatePos()
  }

  // cherche les possibilites de deplacement, puis les rajoutent dans le dom virtuel
  !anim && p[z].pathFinder()
  
  // render tout
  render(anim)
}

// enleve les `p` et les `move` du dom virtuel
function clearZone() {
  for (let i = 0; i < zone.length; i++) {
    for (let j = 0; j < zone[i].length; j++) {
      zone[i][j].x = j
      zone[i][j].y = i
      zone[i][j].p = ''
      zone[i][j].move = null
    }
  }
}

// enleve les classes, les ecouteurs et les dataset
function clearRender() {
  for (let i = 0; i < zone.length; i++) {
    for (let j = 0; j < zone[i].length; j++) {
      
      let tile = tiles[i*zone[i].length + j]

      tile.classList.remove('move'+z)

      if (!tile.classList.contains('bloc')) {
        tile.className = 'tile'
        tile.removeEventListener('click', p[z].move)
        tile.dataset.info = ''
      }
    }
  }
}

// ! affiche les trucs en fonction du dom virtuel
function render(anim) {
  // console.log('render');
  
  for (let i = 0; i < zone.length; i++) {
    for (let j = 0; j < zone[i].length; j++) {

      let tile = tiles[i*zone[i].length + j]

      // affiche les joueurs
      if (zone[i][j].p) {
        tile.classList.add('cube', 'player')
        tile.classList.add(zone[i][j].p)
        // avant ca servait, plus mtn (mais bon ptetre plus tard)
        if (zone[i][j].p === p[z].name) {
          tile.classList.add('playing')
        }
      }

      // affiche les zones on on peut aller
      if (!anim && !zone[i][j].b && zone[i][j].move) {
        tile.classList.add('move'+z)
        // et ajoute un ecouteur
        tile.addEventListener('click', p[z].move)
      }

      // met en data, les infos du dom virtuel 
      tile.dataset.info = JSON.stringify(zone[i][j])
    }
  }
}

// passe la main au prochain joueur
function nextPlayer() {
  // incremente `z`
  z = (z === p.length-1) ? 0 : z+1
}

initEdit()
function initEdit() {
  // ecoute le ALT
  window.addEventListener('keydown', event => {
    if (event.which !== 18) {
      return
    }
  
    // au 1er ALT
    if (!playground.parentElement.classList.contains('editmode')) {
      playground.parentElement.classList.add('editmode')
      console.log('edit mode');

      editStart()
    } else {
      // au 2eme
      playground.parentElement.classList.remove('editmode')
      console.log('normal mode');

      editStop()
    }
  
  })
  
  function editStart() {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].removeEventListener('click', p[z].move)
      tiles[i].addEventListener('click', edit)
    }
  }
  
  function editStop() {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].removeEventListener('click', edit)
    }
    updateZone(false, false, true)
  }
  
  // ajoute ou enleve des blocs au clic
  function edit(event) {  
    
    // ca depend si on clique sur le `tile` ou la `face`, la dans les 2 cas on recupere bien les infos
    let data = event.target.dataset.info ? JSON.parse(event.target.dataset.info) : JSON.parse(event.target.parentElement.dataset.info)
    let newBloc = {x: data.x, y: data.y}
    
    // on pull le localstorage
    localStorage = window.localStorage.getItem('bloc')
  
    // on verifie si le bloc cliqué existe ou pas dans le localstorage
    let exists = localStorage.indexOf(`{"x":${newBloc.x},"y":${newBloc.y}}`) !== -1
    
    // on push un nouveau localstorage
    if (!exists) {
      // +
      window.localStorage.setItem('bloc', localStorage + `{"x":${newBloc.x},"y":${newBloc.y}}`)
    } else {
      // -
      window.localStorage.setItem('bloc', localStorage.replace(`{"x":${newBloc.x},"y":${newBloc.y}}`, ''))
    }
  
    // on update le dom virtuel
    zone[newBloc.y][newBloc.x].b = !exists
  
    // on update le dom
    tiles[newBloc.y*zone[newBloc.y].length + newBloc.x].classList.toggle('cube', !exists)
    tiles[newBloc.y*zone[newBloc.y].length + newBloc.x].classList.toggle('bloc', !exists)
  }

}

// donne une position aleatoire
function randPos(player) {
  let randX, randY
  do {
   randX = Math.floor(Math.random() * rootWidth)
   randY = Math.floor(Math.random() * rootHeight)
  } while (zone[randY][randX].b || zone[randY][randX].p);
  
  zone[randY][randX].p = player
  return {x: randX, y: randY}
}