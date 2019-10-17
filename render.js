//alert("a") ;
let canvas = document.querySelector("#myCanvas") ;
let ctx = canvas.getContext("2d") ;
let autoPlay = true

const switchAutoPlay = () => {
    autoPlay = !autoPlay
}

//ball : 
let y = canvas.height / 2   +50 ;
let x = (canvas.width / 2 ) - 20 ;
let ballRadius = 2.5 ;
let dx = -3 ; // original set to -1.5
let dy = -5 ; // original set to -2.4
let live = 10 ;
//paddle
let paddleHeight = 2 ;
let paddleWidh = 40 ;
let paddleX = (canvas.width - paddleWidh )/2 ;

//keyboard :
let rightPressed = false ;
let leftPressed = false ;

// bricks :
let brickRowCount = 40 ;
let brickColumnCount = 96 ;
let brickWidh = 5 ;
let brickHeight = 5 ;
let brickPadding = 0 ;
let brickOffsetTop = 0 ;
let brickOffsetleft = 00 ;

let bricks = [] ;

for(let c = 0 ; c < brickColumnCount ; c++){
    bricks[c] = [] ;
    for(let r = 0 ; r < brickRowCount +10  ; r++){
        bricks[c][r] = {x : 0 , y : 0 , status : 1} ;
    }
}

const zidou = () => {
    brickRowCount++ ;
    live-- ;
}

const drawBricks = () =>{
    for(let c = 0 ; c < brickColumnCount ; c++){
        for(let r = 0 ; r < brickRowCount ; r++){
            if(bricks[c][r].status == 1){
                let brickX = c*(brickWidh + brickPadding) +brickOffsetleft ;
                let brickY = r*(brickHeight + brickPadding) + brickOffsetTop ;
                let stat = bricks[c][r].status ;
                bricks[c][r] = {x : brickX , y : brickY , status : stat} ;
                ctx.beginPath() ;
                ctx.rect(brickX , brickY , brickWidh , brickHeight) ;
                ctx.fillStyle = "#0095DD" ;
                ctx.fill() ;
                ctx.closePath() ;
            }
        }
    }
}

const collisionDetection = () => {
    for(let c = 0 ; c < brickColumnCount ; c++){
        for(let r = 0 ; r < brickRowCount ; r++){
            let b = bricks[c][r] ;
            let ballEdgeX = x ;
            let ballEdgeY = y - ballRadius ;
            if(bricks[c][r].status == 1  && ballEdgeY < b.y + brickHeight && ballEdgeY > b.y){
                if(ballEdgeX > b.x && ballEdgeX < b.x + brickWidh ){
                    dy = -dy ;
                    //bricks[c][r].x = 0 ;
                    //bricks[c][r].y = 0 ;
                    bricks[c][r].status = 0 ;
                }
            }
        }
    }
}

const keyDownHandler = (e) => {
    if(e.key == "right" || e.key == "ArrowRight"){
        rightPressed = true ;
    }
    else if(e.key == "left" || e.key == "ArrowLeft"){
        leftPressed = true ;
    }
    if(e.key == "s"){
        //alert('now') ;
        dy += 0.5 ;
    }
}

const keyUpHandler = (e) => {
    if(e.key == "right" || e.key == "ArrowRight"){
        rightPressed = false ;
    }
    else if(e.key == "left" || e.key == "ArrowLeft"){
        leftPressed = false ;
    }
}

const drawPaddle = () => {
    ctx.beginPath() ;
    ctx.rect(paddleX , canvas.height - 5 , paddleWidh , paddleHeight) ;
    ctx.fillStyle = "blue" ;
    ctx.fill() ;
    ctx.closePath() ;
}

const drawBall = () => {
    ctx.beginPath() ;
    ctx.arc(x , y ,ballRadius , 0 , 6.28) ;
    ctx.fillStyle = "blue" ;
    ctx.fill() ;
    ctx.closePath() ;
}

const checkWallCollision = () => {
    if( ((y + dy - ballRadius) < 0 ) ){
        dy = -1.01*dy ;
    }
    if( ((x + dx - ballRadius) < 0 ) || (x + dx + ballRadius) > canvas.width ){
        dx = -1.01*dx ;
    }
    if( (y + dy + ballRadius) > canvas.height ){
        if(x + ballRadius > paddleX && x - ballRadius < (paddleX + paddleWidh) ){
            dy = -1.01*dy ;
        }
        else{
            // zidou
            y =  canvas.height - 50;
            x = paddleX ;
            dy = -dy ;
            //zidou() ;
            if(live == 0){
            //alert("GAME OVER");
            //clearInterval(interval) ;
            //document.location.reload() ;    
            }else{
                zidou() ;
            }
            //alert("GAME OVER");
            //clearInterval(interval) ;
            //document.location.reload() ;
        }
    }
}

const aiHelp = () => {
    // console.log('ai helper working')
    // console.log("ball x : " , x)
    // console.log("paddle : x" , paddleX)
    if(autoPlay){
        if(x > paddleX+paddleWidh/2){
            leftPressed = false
            rightPressed = true
        }
        else if(x < paddleX+paddleWidh/2){
            rightPressed = false
            leftPressed = true
        }
        else{
            rightPressed = false
            leftPressed = false
        }
    }
}

// loop of the game 
const draw = () => {
    ctx.clearRect(0 , 0 , canvas.width , canvas.height ) ;
    checkWallCollision() ;
    drawBall() ;
    x += dx ;
    y += dy ;
    drawBricks() ;
    collisionDetection() ;
    drawPaddle() ;
    if(leftPressed && paddleX > 0 ){paddleX -= 5 ;}
    else if(rightPressed && (paddleX + paddleWidh) < canvas.width ){paddleX +=5 ;}
    aiHelp()
}

var interval = setInterval(draw , 1) ; // original frame = 10

document.addEventListener("keydown" , keyDownHandler , false ) ; // why false parameter ?? 
document.addEventListener("keyup" , keyUpHandler , false ) ;
