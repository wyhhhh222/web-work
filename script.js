// 获取画布和上下文
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 获取按钮和分数元素
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreElement = document.getElementById('score');

// 游戏参数
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

// 蛇的初始位置和速度
let snake = [
    { x: 10, y: 10 }
];
let velocityX = 0;
let velocityY = 0;
let speed = 7; // 蛇的移动速度

// 食物的初始位置
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// 游戏状态
let gameRunning = false;
let gameOver = false;
let gameInterval;

// 开始游戏
function startGame() {
    if (!gameRunning && !gameOver) {
        gameRunning = true;
        gameInterval = setInterval(gameLoop, 1000 / speed);
        startBtn.disabled = true;
    }
}

// 重新开始游戏
function restartGame() {
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    placeFood();
    gameRunning = false;
    gameOver = false;
    startBtn.disabled = false;
}

// 随机放置食物
function placeFood() {
    // 确保食物不会出现在蛇身上
    let newFoodPosition;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFoodPosition = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // 检查食物是否在蛇身上
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFoodPosition.x && snake[i].y === newFoodPosition.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = newFoodPosition;
}

// 游戏主循环
function gameLoop() {
    if (gameOver) {
        clearInterval(gameInterval);
        return;
    }
    
    // 更新蛇的位置
    updateSnake();
    
    // 检查游戏是否结束
    checkGameOver();
    
    if (gameOver) {
        drawGame();
        return;
    }
    
    // 绘制游戏
    drawGame();
}

// 更新蛇的位置
function updateSnake() {
    // 创建新的蛇头
    const head = { 
        x: snake[0].x + velocityX, 
        y: snake[0].y + velocityY 
    };
    
    // 将新蛇头添加到蛇身前面
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score++;
        scoreElement.textContent = score;
        
        // 放置新的食物
        placeFood();
    } else {
        // 如果没有吃到食物，移除蛇尾
        snake.pop();
    }
}

// 检查游戏是否结束
function checkGameOver() {
    const head = snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }
    
    // 检查是否撞到自己的身体
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    
    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
        // 蛇头用不同颜色
        if (i === 0) {
            ctx.fillStyle = 'darkgreen';
        } else {
            ctx.fillStyle = 'green';
        }
        
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        
        // 绘制蛇身体的边框
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
    
    // 如果游戏结束，显示游戏结束信息
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '20px Arial';
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('点击"重新开始"按钮再玩一次', canvas.width / 2, canvas.height / 2 + 50);
    }
}

// 键盘事件监听
document.addEventListener('keydown', function(event) {
    if (!gameRunning) return;
    
    // 防止蛇反向移动
    switch(event.key) {
        case 'ArrowUp':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
});

// 按钮事件监听
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// 初始绘制游戏
drawGame();