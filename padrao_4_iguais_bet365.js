// ==UserScript==
// @name         padrao_4_iguais_bet365
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Esta função faz o envio de forma esporádica a cada 30 segundos de sinais bet 365
// @author       Gustavo Martins
// @match        https://bbtips.com.br/speedway/horarios
// @match        https://app.bbtips.com.br/speedway/horarios
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bbtips.com.br
// @grant        GM_xmlhttpRequest
// ==/UserScript==


(function () {
    "use strict";
    const delay = 30 * 1000;
    let lastSentMessage = "";
    let ultimoPadrao = "ultimo";
    let penultimoPadrao = "penultimo"
    let antepenultimo = "antepenultimo"
    const token = "6747759570:AAFw4-rtwKN0kG5zGYdO8db397kSyrDGMBQ";
    const chat_id = "5754261195";

    function sendMessage(text) {
        if (text !== lastSentMessage) {
            lastSentMessage = text;
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: `chat_id=${chat_id}&text=${encodeURIComponent(text)}`,
                onload: function (response) {
                    console.log("Response received from Telegram:", response.responseText);
                },
                onerror: function (response) {
                    console.error("Error sending message:", response.responseText);
                },
            });
        }
    }

    // Função principal para verificar novas colunas
    function checkForNewColumn() {
        // Seleciona a primeira linha da tabela
        const firstRow = document.querySelector("body > app-root > app-horarios > main > section > div.row.d-flex.justify-content-around.mt-1 > div.col-md-10.mt-6 > table > tbody > tr:nth-child(1)");

        if (!firstRow) {
            // Se não houver linha, exibe um erro e encerra a função
            console.error("Nenhuma linha encontrada.");
            return;
        }

        // Seleciona todas as células da linha
        const cells = firstRow.querySelectorAll("td.SemDados");

        // Itera sobre as células da direita para a esquerda
        for (let i = cells.length - 2; i >= 0; i--) {
            const currentCell = cells[i];
            const nextCell = cells[i + 1];

            // Obtém os valores das células atual e seguinte
            const currentValues = getCellValues(currentCell);
            const nextValues = getCellValues(nextCell);

            // Encontra os valores que estão em ambas as células
            const intersectingValues = getIntersectingValues(currentValues, nextValues);
            const concatValues = getConcatValues(currentValues, nextValues);

            // Conta a ocorrência de valores repetidos
            const dicionario = countValues(concatValues);


            // Verifica a condição para processar a mensagem
            if (checkCondition(intersectingValues, dicionario)) {
                const nova_mensagem = `Padrão 4 Valores Iguais: \n1ª ${currentValues} \n2ª${nextValues} \nPadrões: ${Array.from(intersectingValues)}`;
                // Lida com o novo padrão
                handleNewPattern(nova_mensagem);
            }
        }
    }

    // Obtém os valores de uma célula
    function getCellValues(cell) {
        const spanElements = cell.querySelectorAll("span");
        return Array.from(spanElements, span => span.textContent.trim());
    }

    // Encontra os valores que estão em ambas as células
    function getIntersectingValues(currentValues, nextValues) {
        return new Set(currentValues.filter(value => nextValues.includes(value)));
    }

    function getConcatValues(currentValues, nextValues) {
        let listaConcatenada = currentValues.concat(nextValues);
        return listaConcatenada.map(parseFloat);
    }

    // Conta a ocorrência de valores repetidos
    function countValues(values) {
        const dicionario = {};
        values.forEach(value => {
            dicionario[value] = (dicionario[value] || 0) + 1;
        });
        return dicionario;
    }

    // Verifica a condição para processar a mensagem
    function checkCondition(concatValues, dicionario) {
        const valorEncontrado = Object.values(dicionario).some(contagem => contagem >= 4);
        return concatValues.size >= 1 && valorEncontrado;
    }

    // Lida com o novo padrão
    function handleNewPattern(nova_mensagem) {
        if (nova_mensagem !== ultimoPadrao && ultimoPadrao !== penultimoPadrao && nova_mensagem !== penultimoPadrao && penultimoPadrao !== antepenultimo) {
            antepenultimo = penultimoPadrao;
            penultimoPadrao = ultimoPadrao;
            ultimoPadrao = nova_mensagem;
            console.log(`Nova Mensagem: ${nova_mensagem}`);
            sendMessage(nova_mensagem);
        } else {
            console.log("Estão tentando passar, mas estamos travando aqui!");
        }
    }

    setInterval(checkForNewColumn, delay);
})();
