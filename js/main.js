let scoreBlock,          // отбражнение очков
    score = 0;           // сами очки

const config = {         // настройки игры
    step:      0,        // пропускать игровой цикл
    maxStep:   6,        // пропускать игровой цикл 
    sizeCell:  16,       // размер одной ячейки
    sizeBerry: 16 / 4    // размер ягоды
}

const snake = {          // настройки змейки 
    x: 160,              // координаты
    y: 160,              // координаты
    dx: config.sizeCell, // скорость по вертикали
    dy: 0,               // скорость по горизонтали
    tails: [],           // массив ячеек под контролем змейки
    maxTails: 3          // кол-во ячеек
}

//координаты ягоды
let berry = { 
    x: 0,
    y: 0
}

// Получаем canvas 
let canvas  = document.querySelector('#game-canvas'),
    context = canvas.getContext('2d');
scoreBlock  = document.querySelector('.game-score .score-count');
drawScore();

// __________________________________________________________________________________
// Игрововой цикл
function gameLoop() {
    
    requestAnimationFrame( gameLoop );     // вызываем requestAnimationFrame > передаем игровой цикл > gameLoop будет вызываться бесконечно
    if ( ++config.step < config.maxStep) { // проверка > если положительная > пропускаем дальнейшую фунц.
                                           // за счет этого мы можем контролировать скорость отрисовки на экране
        return;
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height); // каждый кадр необходимо очищать canvas
    
    // заново отрисовать все элементы
    drawBerry();
    drawSnake();
}

requestAnimationFrame( gameLoop );

// Отображаем змейку на экране
function drawSnake() {
    // меняем координаты змейки согласно скорости
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();
    // todo бордер 

    // добавляет в начало объект с X и Y координатами
    snake.tails.unshift( { x: snake.x, y: snake.y } );

    // условие: если кол-во доч. элем. у змейки больше чем разрешено > удаляем последний элемент
    if ( snake.tails.length > snake.maxTails ) {
        snake.tails.pop();
    }

    // перебираем все дочерние элементы у змейки + отрисовываем их\проверяем на соприкосновение с друг другом и ягодой
    snake.tails.forEach( function(el, index) {
        if (index == 0) {
            context.fillStyle = "#FA0556";
        } else {
            context.fillStyle = "#A00034";
        }
        context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

        // проверям координаты ягоды и змейки
        // если совпадают > увел. хвост у змейки
        if ( el.x === berry.x && el.y === berry.y) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }
        
        // проверяем соприкосновение змейки с хвостом
        // если совпадают > запускаем игру заново
        for (let i = index + 1; i < snake.tails.length; i++) {
            
            if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) {
                refreshGame();
            }
        }
    });
}

// Границы canvas
function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if ( snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if ( snake.y >= canvas.height) {
        snake.y = 0;
    }
}

// Функция переапуска игры
function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails =[];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

// Пустая функция drawBerry
function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034";
    context.arc ( berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI );
    context.fill();
}

// Функция рандомных значений у ягоды
function randomPositionBerry() {
    berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
    berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}


// __________________________________________________________________________________

// Функция обработки очков 
function incScore() {    // увеличивает кол-во очков на ед.
    score++; 
    drawScore();
}

// Функция отображения увел-ия очков
function drawScore() {   // отображает увел. очков от incScore
    scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min) + min ); // принимает диапозон чисел и возвращает рандомное значение в заданном диапозоне
}

// Назначаем кнопки на клавиатуре
document.addEventListener("keydown", function(e) {
	if ( e.code == "KeyW" ) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyA" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "KeyS" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyD" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});
