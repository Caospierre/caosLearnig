const totalPrisoner = 50
const getArray = () => Array.from({length: totalPrisoner}, (_, index) => index + 1);
const prisoners = getArray()

const boxes = getArray().slice().sort(() => Math.random() - 0.5);

console.log(boxes)

function searchBoxes(prisoner, originalSearch = prisoner, count = 0) {
    count += 1
    const findBox = boxes[prisoner - 1];
    const prisonerFind = findBox === originalSearch

    if (count <= 50) {
        if (prisonerFind) {
            console.log(`Busqueda nro: ${count} encontraste la caja del  prisionero:${originalSearch}`)
            return true
        } else {
            console.log(`Busqueda nro: ${count} en la caja número ${prisoner} encontraste el codigo ${findBox}, no le pertence al prisionero ${originalSearch}`);

            return searchBoxes(findBox, originalSearch, count)
        }
    } else {
        console.log(`busqueda ${count} murio el prisionero #${prisoner}`);
        return false
    }


}

const result = prisoners.map((prisoner) => {
    console.log("-------------------------\n")
    return searchBoxes(prisoner)
})
const percent = (result.reduce((total, valor) => total + Number(valor), 0) / result.length) * 100;
const survivors = result.filter((value) => value).length;
console.log(result)
console.log(`sobrevivieron  ${survivors}, murieron ${totalPrisoner - survivors}`);

console.log(`probabilidad de que sobrevivan todos los prisioneros ${Number(percent)}%`);




