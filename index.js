const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.9
const keys = {
    a : {
        pressed : false
    },

    d : {
        pressed : false 
    },
    w : {
        pressed : false 
    },
    ArrowRight : {
        pressed : false
    },
    ArrowLeft : {
        pressed : false 
    },
    ArrowUp : {
        pressed : false
    }
}

canvas.width = 1024 
canvas.height = 576
c.fillRect(0,0,canvas.width, canvas.height)
class Sprite{
    constructor({position,velocity,color, offset}){
        
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height  = 150
        this.lastkeys
        this.attackBox = {
            position : {
                x : this.position.x,
                y : this.position.y
            },
            width : 100 ,
            height : 50,
            offset,
        }
        this.color = color
        this.isAttacking
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect (this.position.x , this.position.y, this.width  , this.height)

        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect (this.attackBox.position.x, this.attackBox.position.y,this.attackBox.width, this.attackBox.height)
        }
        
    }

    update(){
        this.draw()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }
        else this.velocity.y += gravity
    }
    attack (){
        this.isAttacking = true 
        setTimeout(()=>{
            this.isAttacking = false;
        },100 )
    }
}

const player = new Sprite({
    position: {
        x : 0,
        y : 0
    },
    velocity : {
        x : 0,
        y : 0,
    },
    color : 'red',
    offset : {
        x : 0,
        y : 0
    }
})

const enemy = new Sprite({
    position: {
        x : 400,
        y : 30
    },
    velocity : {
        x : 0,
        y : 0
    },
    color : 'yellow',
    offset : {
        x : -50,
        y : 0
    }
})

function rectangularCollision({rectangler1 , rectangler2}){
    return (
        rectangler1.attackBox.position.x + rectangler1.attackBox.width >= rectangler2.position.x  &&
        rectangler1.attackBox.position.x <= rectangler2.position.x + rectangler2.width &&
        rectangler1.attackBox.position.y + rectangler1.attackBox.height >= rectangler2.position.y &&
        rectangler1.attackBox.position.y <= rectangler2.position.y + rectangler2.height
    )
}


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
// hanh dong cua player
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
    }
    else if(keys.d.pressed && player.lastKey ==='d') {
        player.velocity.x = 5
    }


// hanh dong cua enemu
    if(keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight') {
        enemy.velocity.x = 5
    }
    else if(keys.ArrowLeft.pressed && enemy.lastKey ==='ArrowLeft') {
        enemy.velocity.x = -5
    }

    // detect for collision
    if( rectangularCollision({
        rectangler1 : player,
        rectangler2  : enemy
    }) && player.isAttacking ){
            player.isAttacking = false
            console.log('Player attacking ')
        }

    if( rectangularCollision({
        rectangler1 : enemy,
        rectangler2  : player
    }) && enemy.isAttacking ){
            enemy.isAttacking = false
            console.log('Enemy attacking ')
        }
}

animate()

window.addEventListener('keydown', (event) =>{
    console.log(event.key);
    switch(event.key){
        case 'd' : 
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a' : 
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w' : 
            player.velocity.y = -20
            player.lastKey = 'w'
            break;
        case ' ' : 
            player.attack()
            break;


        case 'ArrowRight' : 
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft' : 
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp' : 
            enemy.velocity.y = -20
            enemy.lastKey = 'ArrowUp'
            break;
        case 'ArrowDown' : 
            enemy.attack()
            break;
    }
    console.log(event.key)
} )

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd' : 
            keys.d.pressed = false
            break;
        case 'a' :
            keys.a.pressed = false
            break;
        case 'w' :
            keys.w.pressed = false
            break;
        case 'ArrowRight' : 
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowUp' :
            keys.ArrowUp.pressed = false
            break; 
    }
    console.log(event.key)
} )

