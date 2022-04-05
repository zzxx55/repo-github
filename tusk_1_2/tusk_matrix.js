function matrix(matrixSize) {

    let mainArr = new Array(matrixSize)
    let count = 1;

    for (let i = 0; i < matrixSize; i++) {
        mainArr[i] = new Array()

        if (i % 2 == 0) {
            for (let j = 0; j < matrixSize; j++) {
                mainArr[i].push(count)
                count++
            }

        } else {
            for (let j = 0; j < matrixSize; j++) {
                mainArr[i].unshift(count)
                count++
            }

        }



    }

    return console.log(mainArr)

}


matrix(4)

