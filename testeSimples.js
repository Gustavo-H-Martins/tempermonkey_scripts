// Encontra os valores que estão em ambas as células
function getIntersectingValues(currentValues, nextValues) {
    return new Set(currentValues.filter(value => nextValues.includes(value)));
}

function getConcatValues(currentValues, nextValues) {
    let listaConcatenada = currentValues.concat(nextValues);
    return listaConcatenada.map(parseFloat);
}

// Verifica a condição para processar a mensagem
function checkCondition(intersectingValues, dicionario) {
    const hasNonEmptyValues = intersectingValues.size >= 1 && Array.from(intersectingValues).some(value => value !== "");
    const valorEncontrado = Object.values(dicionario).some(contagem => contagem >= 4);
    
    return hasNonEmptyValues && valorEncontrado;
}

// Conta a ocorrência de valores repetidos
function countValues(values) {
    const dicionario = {};
    values.forEach(value => {
        dicionario[value] = (dicionario[value] || 0) + 1;
    });
    return dicionario;
}

// Obtém os valores das células atual e seguinte
let currentValues = ["1.2", "4.0", "", ""];
let nextValues = ["9.5", "10.00", "", ""];

// Encontra os valores que estão em ambas as células
const intersectingValues = getIntersectingValues(currentValues, nextValues);
const concatValues = getConcatValues(currentValues, nextValues);


// Conta a ocorrência de valores repetidos
const dicionario = countValues(concatValues);


// Verifica a condição para processar a mensagem
if (checkCondition(intersectingValues, dicionario)) {
    const nova_mensagem = `Padrão 4 Valores Iguais: \n1ª ${currentValues} \n2ª ${nextValues} \nPadrões: ${Array.from(intersectingValues)}`;
    // Lida com o novo padrão
    console.log(nova_mensagem);
} else {
    console.log("Condição não atendida. Não há valores não vazios suficientes.");
}
