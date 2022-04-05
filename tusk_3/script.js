let matrix = null // создаем поле в консоли
let running = null //остановка в случае победы или поражения
let flagCount = null //счетчик выставленных флагов



init(20, 20, 24)// иниацилизируем функцию создания поля
countTime(0, 00)// иниацилизируем таймер


document
    .querySelector('button')
    .addEventListener('click', () => init(20, 20, 24))// иниацилизируем функцию создания поля для кнопки рестарт

function init(columns, rows, mines) { // создаем игровое поле, мины, флаги
    matrix = getMatrix(columns, rows)
    running = true
    flagCount = mines * 2



    for (let i = 0; i < mines; i++) { // ставим мины
        setRandomMine(matrix)
    }



    update()// обновление отрисовки поля в окне браузера
}


function update() {
    if (!running) {
        return
    }
    const gameElement = matrixToHtml(matrix) //переменная в которой хранится схема отрисовки поля

    const appElement = document.querySelector('#app')// находим созданый див штмл с ид
    appElement.innerHTML = "";// чистим его 
    appElement.append(gameElement)// отправляем внутрь дива с ид все нашу отрисовку

    appElement
        .querySelectorAll('img') // находим в отрисовке картинки
        .forEach(imgElement => {
            imgElement.addEventListener('mousedown', mousedownHandler)// для каждой прикрепляем слушатель событий на нажатие мыши
            imgElement.addEventListener('mouseup', mouseupHandler) // для каждой прикрепляем слушатель событий на отпускание мыши
            imgElement.addEventListener('mouseleave', mouseleaveHandler)// для каждой прикрепляем слушатель событий на сдвиг мыши
        })

    if (isLosing(matrix)) {
        alert('Вы проиграли')
        running = false
    }
    if (isWin(matrix)) {
        alert('Вы победили')
        running = false
    }

}


function mousedownHandler(event) { //функция обработчик всегда принимает ивент
    const { cell, left, right } = getInfo(event)



    if (left) {
        cell.left = true;
    }
    if (right) {
        cell.right = true;
    }
    if (cell.left && cell.right) {
        bothClick(cell)
    }




    update()

}

function mouseupHandler(event) { //функция обработчик всегда принимает ивент
    //const info = getInfo(event)
    const { cell, left, right } = getInfo(event) //Применили декомпазицию и сразу достали из объектов интерессующие переменные
    const both = cell.right && cell.left && (left || right) //проверяем тру в объекте и в обработчике для лево и право
    const leftMouse = !both && cell.left && left//пооверяем что не обе и далее что тру для лево внутри объекта и в фукции обработчике
    const rightMouse = !both && cell.right && right//пооверяем что не обе и далее что тру для право внутри объекта и в фукции обработчике

    if (both) {
        forEach(matrix, x => x.paten = false) // перебираем весь массив и везде меняем значение потенсальных клеток 
    }

    if (left) { //если отпустили левое то в внутри объекта меняем на фолс
        cell.left = false;
    }
    if (right) {//если отпустили право то в внутри объекта меняем на фолс
        cell.right = false;
    }

    if (leftMouse) {
        leftClick(cell)
    }
    else if (rightMouse) {
        rightClick(cell)
    }


    update()
}

function mouseleaveHandler(event) { //функция обработчик всегда принимает ивент
    const { cell, left, right } = getInfo(event)
    cell.right = false;
    cell.left = false;

    update()
}


function getInfo(event) {// фуункция дающая на много полезной инфы
    const element = event.target
    const cellId = parseInt(element.getAttribute('data-cell-id'))// возвращет нам всю информацию об кнопке из объкта при клике на картинки
    return { // до этого возвращало фолс так как ожидалось число а приходила строка, поэтому используем парс инт
        left: event.which === 1, // клик левой кнопкой
        right: event.which === 3,// клик правой кнопкой
        cell: getCellById(matrix, cellId)// вся инфа по объекту исходя из ид
    }
}

function leftClick(cell) {//обрабатываем левый клик 
    if (cell.show || cell.flag) {// если она уже открыта или на ней стоит флаг то нечего не делаем
        return
    }
    cell.show = true // иначе открываем ее

    if (!cell.mine && !cell.number) {
        showSpread(matrix, cell.x, cell.y)


    }
}

function rightClick(cell) { // обрабатываем правый клик 
    if (!cell.show) { // если клетка не открыта 
        cell.flag = !cell.flag // то ставим и снимаем флаг 
        countFlag(cell)
    }
    return
}

function bothClick(cell) {// клик обеими кнопками 
    if (!cell.show || !cell.number) {//если кнопка закрыта или на ней нет числа то ничего
        return
    }

    const cells = getAroundCells(matrix, cell.x, cell.y)//массив с координатами выбраной ячейки
    const flags = cells.filter(x => x.flag).length //переменная в которой получаем количество флагов через длинну массива с координатами флагов

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(x => {
                x.show = true
                showSpread(matrix, cell.x, cell.y)
            })


    } else {
        cells
            .filter(x => !x.flag && !x.show) // берем только те ячейки где флаг опущен или она нам не показана 
            .forEach(cell => cell.paten = true) // и добавляем им серый фон
    }

    //1,12,45
}

function countFlag(cell) {


    if (cell.flag) {
        return --flagCount
    }
    else if (!cell.flag) {
        return ++flagCount
    }

}

document
    .getElementById('flagCount')
    .innerHTML = `Флагов:${flagCount}`// помещаем счетчик флагов в штмл