// Dicionário (supondo que você já tenha o dicionário preenchido)
const dicionario = {"5": 10, "2": 6, "3": 2, "1": 1, "bala": 765};

// Encontra todos os números com contagem maior ou igual a 4
const numerosMaiorQueQuatro = Object.entries(dicionario)
    .filter(([numero, contagem]) => contagem >= 4)
    .map(([numero, contagem]) => numero);

// Exibe o resultado
if (numerosMaiorQueQuatro.length > 0) {
    console.log("Números com contagem maior ou igual a 4:", numerosMaiorQueQuatro.join(', '));
} else {
    console.log("Nenhum número tem contagem maior ou igual a 4.");
}
