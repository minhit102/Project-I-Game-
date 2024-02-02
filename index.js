const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let sound = new Audio('./audio/nhac_nen (mp3cut.net).mp3');
let sound_jump = new Audio('./audio/jump.mp3');
let sound_run = new Audio('./audio/run.mp3');
let suund_attack = new Audio('./audio/attack.mp3');
let sound_attacked = new Audio('./audio/attacked.mp3')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/anh2.jpg'
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/Player1/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 138
  },
  sprites: {
    idle: {
      imageSrc: './img/Player1/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/Player1/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/Player1/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/Player1/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/Player1/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/Player1/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/Player1/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/Player2/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 86
  },
  sprites: {
    idle: {
      imageSrc: './img/Player2/Idle.png',
      framesMax: 10
    },
    run: {
      imageSrc: './img/Player2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/Player2/Jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/Player2/Fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/Player2/Attack1.png',
      framesMax: 7
    },
    takeHit: {
      imageSrc: './img/Player2/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/Player2/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})


const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  sound.play();
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  sound.play();
  background.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    sound_attacked.play();

    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 4
  ) {
    player.takeHit()
    sound_attacked.play()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        sound_run.play()
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        sound_run.play()
        break
      case 'w':
        player.velocity.y = -20
        sound_jump.play();
        break
      case ' ':
        player.attack()
        suund_attack.play()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        sound_run.play()
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        sound_run.play()
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        sound_jump.play();
        break
      case 'ArrowDown':
        enemy.attack()
        suund_attack.play()

        break
    }
  }
})
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
