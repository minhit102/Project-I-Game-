const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.9
const keys = {
    a: {
        pressed: false
    },

    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

canvas.width = 1368
canvas.height = 666
c.fillRect(0, 0, canvas.width, canvas.height)
class Sprite {
    constructor({
        position,
        imageSrc,
        scale,
        framesMax,
        offset = { x : 0 , y: 1},
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }
    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }
    update() {
        this.draw();
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }
            else this.framesCurrent = 0;
        }
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x : 0 , y: 1}
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkeys
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50,
            offset,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    /*draw() {
         c.fillStyle = this.color
         c.fillRect(this.position.x, this.position.y, this.width, this.height)
 
         if (this.isAttacking) {
             c.fillStyle = 'green'
             c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
         }
 
     }*/

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }


    update() {
        this.draw()
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }
            else this.framesCurrent = 0;
        }
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 148) {
            this.velocity.y = 0
        }
        else this.velocity.y += gravity
    }
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/bg_livel_1.png',
    scale: 1,
    framesMax: 1
});


const shop = new Sprite({
    position: {
        x: 964,
        y: 264
    },
    imageSrc: './img/shop_anim.png',
    scale: 1.2,
    framesMax: 6
});

const fence_left = new Sprite({
    position: {
        x: 795,
        y: 525
    },
    imageSrc: './img/decorations/fence_1.png',
    scale: 2.4,
    framesMax: 1
});
const fence_1 = new Sprite({
    position: {
        x: 564,
        y: 525
    },
    imageSrc: './img/decorations/fence_1.png',
    scale: 2.4,
    framesMax: 1
});
const fence_right = new Sprite({
    position: {
        x: 1208,
        y: 525
    },
    imageSrc: './img/decorations/fence_2.png',
    scale: 2.4,
    framesMax: 1
});


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/FreeKnight_v1/Colour1/NoOutline/120x80_PNGSheets/_Idle.png',
    scale: 2.5,
    framesMax: 10,
    offset : { x : 0 , y: 0}
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 30
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'yellow',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/FreeKnight_v1/Colour2/NoOutline/120x80_PNGSheets/_Idle.png',
    scale: 2.5,
    framesMax: 10,
    offset : { x : 0 , y: 1}
})

function rectangularCollision({ rectangler1, rectangler2 }) {
    return (
        rectangler1.attackBox.position.x + rectangler1.attackBox.width >= rectangler2.position.x &&
        rectangler1.attackBox.position.x <= rectangler2.position.x + rectangler2.width &&
        rectangler1.attackBox.position.y + rectangler1.attackBox.height >= rectangler2.position.y &&
        rectangler1.attackBox.position.y <= rectangler2.position.y + rectangler2.height
    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = "Tie"
    }
    else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = "Player Win"
    }
    else {
        document.querySelector('#displayText').innerHTML = "Enemy Win"
    }
    timer = 0;
    document.querySelector('#displayText').style.display = 'flex'
}

let timer = 100
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({ player, enemy, timer });
    }
}
decreaseTimer()
//document.querySelector('#timer').style.width = player.health + '%'


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    fence_left.update()
    fence_right.update()
    fence_1.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // hanh dong cua player
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }


    // hanh dong cua enemu
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    }

    // detect for collision
    if (rectangularCollision({
        rectangler1: player,
        rectangler2: enemy
    }) && player.isAttacking) {
        player.isAttacking = false
        enemy.health = enemy.health - 5
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        console.log('Player attacking ')
    }

    if (rectangularCollision({
        rectangler1: enemy,
        rectangler2: player
    }) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health = player.health - 5
        document.querySelector('#playerHealth').style.width = player.health + '%'
        console.log('Enemy attacking ')
    }

    if (player.health === 0 || enemy.health === 0) {
        determineWinner({ player, enemy, timer })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    console.log(event.key);
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -20
            player.lastKey = 'w'
            break;
        case ' ':
            player.attack()
            break;


        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            enemy.lastKey = 'ArrowUp'
            break;
        case 'ArrowDown':
            enemy.attack()
            break;
    }
    console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 'w':
            keys.w.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break;
    }
    console.log(event.key)
})

