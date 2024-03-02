// Cenário 1: Conjunto com valores dentro do intervalo [3, 5]
let intersectingValues1 = new Set(["5", "4.0", "5.5"]);

// Cenário 2: Conjunto com valores fora do intervalo [3, 5]
let intersectingValues2 = new Set(["2.0", "2.8", "4.0"]);


// Verificações para o Cenário 1
// Verifica se há pelo menos um valor menor ou igual a 3 no conjunto
let hasValueLessThanThree = Array.from(intersectingValues1).some(value => parseFloat(value) <= 3);

// Verifica se há pelo menos um valor maior ou igual a 5 no conjunto
let hasValueGreaterOrEqualFive = Array.from(intersectingValues1).some(value => parseFloat(value) >= 5);
console.log("Cenário 1 - Resultado esperado: true, Resultado real:", hasValueLessThanThree , hasValueGreaterOrEqualFive);

// Verificações para o Cenário 2
// Verifica se há pelo menos um valor menor ou igual a 3 no conjunto
hasValueLessThanThree = Array.from(intersectingValues2).some(value => parseFloat(value) <= 3);

// Verifica se há pelo menos um valor maior ou igual a 5 no conjunto
hasValueGreaterOrEqualFive = Array.from(intersectingValues2).some(value => parseFloat(value) >= 5);
console.log("Cenário 2 - Resultado esperado: false, Resultado real:", hasValueLessThanThree, hasValueGreaterOrEqualFive);
