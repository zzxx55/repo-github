function getMatrix(columns, rows) { //Принимаем количество столбцов и строк 

    const matrix = [] // массив содержащий все строки и ряды
    let idCounter = 1 // id для каждой клетки


    for (let y = 0; y < rows; y++) {
        const row = [] // где колличество массивов это количество строк
        for (let x = 0; x < columns; x++) {
            row.push({ // а колличество объектов в этих массивах количеству рядов
                id: idCounter++, //на каждой итерации цикла добавляем ид каждому объекту
                left: false,
                right: false,
                show: false,
                flag: false,
                mine: false,
                paten: false,
                number: 0,
                x: x, //в ес6 можно не писать х:х а просто х
                y: y
            })
        }

        matrix.push(row)
    }

    return matrix
}
function getRandomFreeCell(matrix) { // ищет свободную клетку которой нет бомб
    const freeCells = []
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x] // селс клетка со значением х,у
            if (!cell.mine) {
                freeCells.push(cell) // если она без мины помещаем в массив клеток без мин
            }
        }
    }

    const index = Math.floor(Math.random() * freeCells.length)

    return freeCells[index] // рандомная клетка с рандомным индесом без мины
}


function setRandomMine(matrix) { //создаем мины 
    const cell = getRandomFreeCell(matrix)// берем любое число сгенерированное рандомным числом и ставим там мину 
    const cells = getAroundCells(matrix, cell.x, cell.y)// передаем х,у мин  

    cell.mine = true; // и за счет того что там есть проверка на мину не может быть дублирования мин

    for (const cell of cells) { //проходим циклом по списку мин и араунд находит все соседние и добавляет единицу
        cell.number += 1 // соотвественно если она рядом с ней увидит мину неслько раз то и число добавит несколько раз 
    }

}

function getCell(matrix, x, y) {
    if (!matrix[y] || !matrix[y][x]) {
        return false
    }
    return matrix[y][x]
}
function getAroundCells(matrix, x, y) {
    const cells = [] // массив со всеми отклонениями вокруг этой клетки
    for (let dx = -1; dx <= 1; dx++) { // по оси х прогоняет по всем 3 значением
        for (let dy = -1; dy <= 1; dy++) { // по оси У и 3 значеям
            if (dx === 0 && dy === 0) { // с 0 координотой будет наша клетка котрую мы передали
                continue // получем 9 разных значений из котрых выкидываем нашу клетку которую передали 
            }

            const cell = getCell(matrix, x + dx, y + dy) // все вариации клеток

            if (cell) { //если клетка найдена то ее добавлем
                cells.push(cell)
            }

        }

    }


    return cells
}


function getCellById(matrix, id) { // связываем id с клеткой
    for (let y = 0; y < matrix.length; y++) { // проходим по всему объекту 
        for (let x = 0; x < matrix.length; x++) {
            const cell = matrix[y][x]
            if (cell.id === id) {// когда ид на картинке равен ид в объекте 
                return cell // возвращаем эту клетку
            }
        }
    }
    return false
}


function matrixToHtml(matrix) {
    const gameElement = document.createElement('div') //создаем элемент див 

    gameElement.classList.add('sapper') // добавляем ему класс сапер

    for (let y = 0; y < matrix.length; y++) {// на всю длинну массива создаем 
        const rowElement = document.createElement('div')// дивы 
        rowElement.classList.add('row')// и добавляем класс

        for (let x = 0; x < matrix[y].length; x++) {// идем по всем Х
            const cell = matrix[y][x]
            let imgElement = document.createElement('img')// создаем элемент имг

            imgElement.draggable = false //убирает пертаскивание картинки
            imgElement.setAttribute('data-cell-id', cell.id)// добовляем ид картинкам чтобы их можно было связать визуализацию с обектом всех клеток
            imgElement.oncontextmenu = () => false // если в фукции контекстоного меню вернуть фалсе то оно не будет появлятся

            rowElement.append(imgElement)// и вставляем дочерним элементом к дивам У
            if (cell.flag) { // при создание проверяем на флаг 
                imgElement.src = 'assets/flag.png'
                continue
            }

            if (cell.paten) {//на тех клетках где есть потесиал отображать серые квадраты
                imgElement.src = 'assets/paten.png'
                continue
            }
            if (!cell.show) {// на то видна клетка или нет
                imgElement.src = 'assets/none.png'
                continue
            }

            if (cell.mine) {// есть мина или нет
                imgElement.src = 'assets/mine.png'
                continue
            }

            if (cell.number) {// есть ли число 
                imgElement.src = 'assets/number' + cell.number + '.png'
                continue
            }
            imgElement.scr = 'assets/free.png'// если нет нечего пустое поле 

        }
        gameElement.append(rowElement)// ров со всеми дивами и вложеными в них картинками вкладываем внутрь основного дива игры
    }

    return gameElement // возвращаем див с вложеными в него дивами и вложеными в них картинками
}


function forEach(matrix, handler) {
    for (let y = 0; y < matrix.length; y++) { // проходим по всему объекту 
        for (let x = 0; x < matrix.length; x++) {
            handler(matrix[y][x])
        }
    }
}



function showEmpty(matrix, x, y) { // открывает все клетки без числа, мины и флага
    const cell = getCell(matrix, x, y)

    if (cell.flag || cell.number || cell.mine) {
        return
    }
    forEach(matrix, x => x._marked = false)

    cell._marked = true

    let flag = true
    while (flag) {
        flag = false

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix.length; x++) {
                const cell = matrix[y][x]

                if (!cell._marked || cell.number) {
                    continue
                }
                const cells = getAroundCells(matrix, x, y)

                for (const cell of cells) {
                    if (cell._marked) {
                        continue
                    }

                    if (!cell.flag || !cell.mine) {
                        cell._marked = true
                        flag = true
                    }
                }
            }
        }

    }

    forEach(matrix, x => {
        if (x._marked) {
            x.show = true
        }
        delete x._marked
    })
}

function isWin() {
    const flags = []
    const mines = []

    forEach(matrix, cell => {
        if (cell.flag) {
            flags.push(cell)
        }
        if (cell.mine) {
            mines.push(cell)
        }
    })
    if (flags.length !== mines.length) {
        return false
    }

    for (const cell of mines) {
        if (!cell.flag) {
            return false
        }
    }
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            const cell = matrix[y][x]

            if (!cell.mine && !cell.show) {
                return false
            }


        }
    }
    return true
}

function isLosing(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            const cell = matrix[y][x]

            if (cell.mine && cell.show) {

                return true
            }


        }
    }
    return false
}

function showMine(matrix) {
    forEach(matrix, cell => {

        cell.show = true

    })

}


let timerCounter

function countTime() { // возникла проблема, что обнулять получается только обновлением страницы

    let timer = document.getElementById('timer')
    let null_min = 0
    let null_sec = 0

    timerCounter = setInterval(() => {
        timer.innerHTML = `${null_min}:${null_sec}` // как поместить финальные значение в алерте апдейта
        null_sec++
        if (null_sec >= 60) {
            null_min++
            null_sec = 0;
        }

    }, 1000);





}




function clearTimer() {

    clearInterval(timerCounter)
    countTime()
}
