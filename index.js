const introMusic = new Audio("./music/introSong.mp3")
const shootingSound = new Audio("./music/shoooting.mp3")
const killEnemySound = new Audio("./music/killEnemy.mp3")
const gameOverSound = new Audio("./music/gameOver.mp3")
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3")
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3")

introMusic.play()
const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context = canvas.getContext("2d")
let playerScore=0
const lightweaponDamage=10
const heavyweaponDamage=20
const HugeweaponDamage=50

let difficulty = 0;
const form = document.querySelector('form')
const scoreBoard = document.querySelector(".scoreBoard")

document.querySelector("input").addEventListener("click",(e)=>{
    e.preventDefault()
    introMusic.pause()
    form.style.display="none"
    scoreBoard.style.display="block"

    const userValue = document.getElementById("difficulty").value
    if (userValue==="Easy"){
        setInterval(spawnEnemy,2500);
        return(difficulty=2)
    }
    if (userValue==="Medium"){
        setInterval(spawnEnemy,2000);
        return(difficulty=3)
    }
    if (userValue==="Hard"){
        setInterval(spawnEnemy,1800);
        return(difficulty=4)
    }
    if (userValue==="Insane"){
        setInterval(spawnEnemy,1500);
        return(difficulty=4)
    }
})

const gameoverLoader=()=>{
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highscore = document.createElement("div");

    highscore.innerHTML = `High Score : ${
        localStorage.getItem('highScore')? localStorage.getItem("highScore"): playerScore }`

        const oldHighScore = localStorage.getItem("highScore") && 
        localStorage.getItem('highScore');

    if(oldHighScore < playerScore){
        localStorage.setItem('highScore',playerScore)

        highscore.innerHTML = `High Score : ${playerScore}`
    }

    gameOverBtn.innerText = "Play Again"

    gameOverBanner.appendChild(highscore);

    gameOverBanner.appendChild(gameOverBtn)

    gameOverBtn.onclick=()=>{
        window.location.reload();
    }

    gameOverBanner.classList.add('gameover')

    document.querySelector("body").appendChild(gameOverBanner)
}


playerPosition={
    x:canvas.width/2,
    y:canvas.height/2
}

//                              *********** PLAYER CLASS *************
class Player {
    constructor(x,y,radius,color){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
    }
    draw(){
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, (Math.PI / 180) * 360,false);
        context.fillStyle=this.color
        context.fill()
    }
    update(){
        this.x+=Math.random()*10
        this.y+= Math.random()*10
    }
}
//                              *********** WEAPON CLASS *************

class Weapon {
    constructor(x,y,radius,color,velocity,damage){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
        this.damage=damage
    }
    draw(){
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, (Math.PI / 180) * 360,false);
        context.fillStyle=this.color
        context.fill()
    }
    update(){
        this.draw(),
        this.x+=this.velocity.x,
        this.y+=this.velocity.y
    }
}

class HugeWeapon {
    constructor(x,y,damage){
        this.x=x
        this.y=y
        this.color="rgba(255,0,133,1)"
    
    }
    draw(){
        context.beginPath()
        context.fillRect(this.x,this.y,75,canvas.height)
        context.fillStyle = this.color;
        
    }
    update(){
        this.draw(),
        this.x+=10
        
    }
}

//                            ************ ENEMY CLASS **************
class Enemy {
    constructor(x,y,radius,color,velocity){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
    }
    draw(){
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, (Math.PI / 180) * 360,false);
        context.fillStyle=this.color
        context.fill()
    }
    update(){
        this.draw(),
        this.x+=this.velocity.x,
        this.y+=this.velocity.y
    }
}

class Particle{
    constructor(x,y,radius,color,velocity){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
        this.alpha=1
    }
    draw(){
        context.save()
        context.globalAlpha = this.alpha
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, (Math.PI / 180) * 360,false);
        context.fillStyle=this.color
        context.fill()
        context.restore()
    }
    update(){
        this.draw(),
        this.x+=this.velocity.x,
        this.y+=this.velocity.y,
        this.alpha -=0.01;
    }
}

const harsh=new Player(
    playerPosition.x ,
    playerPosition.y ,
    20,
    `rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`
    )

const weapons = [];
const enemies = [];
const particles = [];
const hugeweapons = [];
const spawnEnemy = ()=>{
    const enemySize = Math.random()*(40-5)+5;

    const enemyColor=`hsl(${Math.floor(Math.random()*360)},100%,50%)`;

    let random;
    if(Math.random()<0.5){
        random={
            x:Math.random()<0.5?canvas.width+enemySize:0-enemySize,
            y:Math.random()*canvas.height
        }
    }
    else{
        random={
            x:Math.random()*canvas.width,
            y:Math.random()<0.5?canvas.height+enemySize:0-enemySize,
        }
    }

    const myAngle = Math.atan2(canvas.height/2 - random.y,canvas.width/2 - random.x)
    // console.log(myAngle)
    const velocity={
        x:Math.cos(myAngle)*difficulty,
        y:Math.sin(myAngle)*difficulty
    }
     
    enemies.push(new Enemy(random.x,random.y,enemySize,enemyColor,velocity))
}



//                          *****    RECURSION FUNCTION      *****
let animationID;
function animation(){
    animationID=requestAnimationFrame(animation)

    // scoreBoard.innerHTML = `Score : ${playerScore}`;

    context.fillStyle = 'rgba(49, 49, 49,0.2)';
    context.fillRect(0,0,canvas.width,canvas.height)
    // context.clearRect(0,0,canvas.width,canvas.height)
    harsh.draw()

    particles.forEach((particle,particleIndex)=>{
        if(particle.alpha <= 0){
            particles.splice(particleIndex,1)
        }
        else{
            particle.update()
        }
        
    })

    hugeweapons.forEach((hugeweapon,hugeweaponIndex)=>{
        if(hugeweapon.x > canvas.width){
            hugeweapons.splice(hugeweaponIndex,1);
        }
        else{
            hugeweapon.update()
        }
    })
    

    weapons.forEach((weapon,weaponIndex)=>{
        weapon.update()

        if(weapon.x + weapon.radius < 1 ||
            weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width ||
            weapon.y - weapon.radius > canvas.height
            ){
        weapons.splice(weaponIndex,1)
        }
    })

    enemies.forEach((enemy,enemyIndex)=>{
        enemy.update()

        distanceBtwPlayerAndEnemy = Math.hypot(
            harsh.x-enemy.x,
            harsh.y-enemy.y);
            
        if(distanceBtwPlayerAndEnemy - harsh.radius - enemy.radius < 1){
            cancelAnimationFrame(animationID)
        gameOverSound.play();
        hugeWeaponSound.pause();
        shootingSound.pause();
        heavyWeaponSound.pause();
        killEnemySound.pause();
        return gameoverLoader()

        }
    hugeweapons.forEach((hugeweapon)=>{
        const distanceBtwHugeWeaponAndEnemy = hugeweapon.x - enemy.x ;
        if(
            distanceBtwHugeWeaponAndEnemy <= 200 && distanceBtwHugeWeaponAndEnemy >= -200
        ){
            
            playerScore+=10;
            scoreBoard.innerHTML = `Score : ${playerScore}`
            
            
            setTimeout(()=>{
                killEnemySound.play()
                enemies.splice(enemyIndex,1)
            },0) 
        }

    })    
    weapons.forEach((weapon,weaponIndex)=>{
            const distanceBtwWeaponAndEnemy= Math.hypot(
                weapon.x-enemy.x,
                weapon.y-enemy.y);

            if (distanceBtwWeaponAndEnemy - weapon.radius - enemy.radius < 1){

                for (let i = 0; i < enemy.radius*5; i++){
                    particles.push(
                        new Particle(weapon.x , weapon.y, Math.random()*2 , enemy.color, {
                            x:(Math.random() - 0.5) * Math.random()*5,
                            y:(Math.random() - 0.5) * Math.random()*5,
                        })
                    )
                    
                }
                if (enemy.radius > weapon.damage + 8){
                    gsap.to(enemy,{
                        radius: enemy.radius - weapon.damage
                    })
                    setTimeout(()=>{
                        weapons.splice(weaponIndex,1)
                    },0)

                }
                else{

                    playerScore+=10
                    scoreBoard.innerHTML = `Score : ${playerScore}`
                    setTimeout(()=>{
                        killEnemySound.play()

                        enemies.splice(enemyIndex,1)
                        weapons.splice(weaponIndex,1)
                    },0)
                }
            }
        })
    })
}

setInterval(spawnEnemy,5000)

canvas.addEventListener('click',(e)=>{
    shootingSound.play()
    const myAngle = Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2)
    // console.log(myAngle)
    const velocity={
        x:Math.cos(myAngle)*5,
        y:Math.sin(myAngle)*5
    }
    weapons.push(
        new Weapon(
            canvas.width/2,
            canvas.height/2,
            5,
            "white",
            velocity,
            lightweaponDamage

        )
    )
})


canvas.addEventListener('contextmenu',(e)=>{
    e.preventDefault()
    if(playerScore<=0) return;
    
    heavyWeaponSound.play()
    playerScore-=2
    scoreBoard.innerHTML = `Score : ${playerScore}`


    const myAngle = Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2)
    // console.log(myAngle)
    const velocity={
        x:Math.cos(myAngle)*4,
        y:Math.sin(myAngle)*4
    }
    weapons.push(
        new Weapon(
            canvas.width/2,
            canvas.height/2,
            30,
            "cyan",
            velocity,
            heavyweaponDamage

        )
    )
})
addEventListener('keypress',(e)=>{
    if(e.key === " "){

        if(playerScore < 20) return;
    
        playerScore-=20
        scoreBoard.innerHTML = `Score : ${playerScore}`
        hugeWeaponSound.play()
    
        hugeweapons.push(
            new HugeWeapon( 0, 0, )
        )

    }
})
addEventListener("contextmenu",(e)=>{
    e.preventDefault();
})

addEventListener("resize",()=>{
    window.location.reload()
})
animation()
