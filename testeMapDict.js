// Conta a ocorrência de valores repetidos
function countValues(values) {
    const dicionario = {};
    values.forEach(value => {
        dicionario[value] = (dicionario[value] || 0) + 1;
    });
    return dicionario;
}
// Encontra os valores que estão em ambas as células
function getConcatValues(currentValues, nextValues) {
    let listaConcatenada = currentValues.concat(nextValues);
    return listaConcatenada.map(parseFloat);
}
let currentValues  = ["4.5", "2.5", "4.5", "2.75"];
let     nextValues = ["4.5", "4.5", "3.6", "2.5"];

// Encontra os valores que estão em ambas as células
const concatValues = getConcatValues(currentValues, nextValues);



// Conta a ocorrência de valores repetidos
const dicionario = countValues(concatValues);

console.log(concatValues)
console.log(dicionario)