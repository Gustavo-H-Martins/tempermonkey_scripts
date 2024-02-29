// ==UserScript==
// @name         padrao_3_torres_menorBet365
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
  // delay de 30 segundos
  const delay = 30 * 1000;
  let lastSentMessage = "";
  let ultimoPadrao = "ultimo";
  let penultimoPadrao = "penultimo"
  let antepenultimo = "antepenultimo"
  const token = "6747759570:AAFw4-rtwKN0kG5zGYdO8db397kSyrDGMBQ";
  const chat_id = "5754261195";
  // Função auxiliar para obter os valores de uma célula
  const getCellValues = (cell) => {
    return Array.from(cell.querySelectorAll("span")).map((span) =>
      span.textContent.trim()
    );
  };

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

  function checkForNewColumn() {
    // Seleciona apenas a primeira linha da tabela
    let firstRow = document.querySelector(
      "body > app-root > app-horarios > main > section > div.row.d-flex.justify-content-around.mt-1 > div.col-md-10.mt-6 > table > tbody > tr:nth-child(1)"
    );

    if (!firstRow) {
      console.error("Nenhuma linha encontrada.");
      return;
    }

    // Seleciona todas as células da linha
    //let cells = firstRow.querySelectorAll("td.undefined.SemDados");
    let cells = firstRow.querySelectorAll("td.SemDados");

    // Itera sobre cada célula
    for (let i = 0; i < cells.length - 2; i++) {
      let firstCell = cells[i];
      let secondCell = cells[i + 1];
      let thirdCell = cells[i + 2];

      // Obtem os valores das células atual, próxima e após a próxima
      let firstValues = getCellValues(firstCell);
      let secondValues = getCellValues(secondCell);
      let thirdValues = getCellValues(thirdCell);

      // Arrays para armazenar os valores que combinam usando um conjunto para evitar duplicatas
      let intersectingValues = new Set();

     // Itera sobre os valores da 1ª célula e da 3ª célula
     secondValues.forEach((secondValue) => {
           //console.log(typeof firstValue)
        // Verifica se existe correspondente na 1ª célula e depois na 3ª
        if (
          firstValues.includes(secondValue) &&
          parseFloat(secondValue) >= 2.40 &&
          parseFloat(secondValue) <= 3.75
        ) {
          intersectingValues.add(secondValue);
        }
        if (
          thirdValues.includes(secondValue) &&
          parseFloat(secondValue) >= 2.40 &&
          parseFloat(secondValue) <= 3.75
        ) {
          intersectingValues.add(secondValue);
        }
      });
      // Verifica se há mais de 2 valores no array intersectingValues e se os valores são diferentes
      if (intersectingValues.size >= 2) {
          let nova_mensagem = `Padrão 3 Torres: \n1ª${firstValues} \n2ª${secondValues} \n3ª${thirdValues} \nPadrões: ${Array.from(intersectingValues)}`
          // TRAVA PARA ULTIMO E PENULTIMO PADRAO
          if (nova_mensagem != ultimoPadrao && ultimoPadrao != penultimoPadrao && nova_mensagem != penultimoPadrao && penultimoPadrao != antepenultimo) {
              antepenultimo = penultimoPadrao
              penultimoPadrao = ultimoPadrao
              ultimoPadrao = nova_mensagem
              console.log(`Nova Mensagem: ${nova_mensagem}`);
              sendMessage(nova_mensagem);
          }
          else{
            console.log("Estão tentando passar, mas estamos travando aqui!");
        }
        }
    }
  }

  setInterval(checkForNewColumn, delay);
})();
