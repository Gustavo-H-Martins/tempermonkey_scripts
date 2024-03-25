// ==UserScript==
// @name         padrao_5_torres_com_2_pares
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
    // delay de 10 segundos
    const delay = 10 * 1000;
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
        let firstCell   = cells[i];
        let secondCell  = cells[i + 1];
        let thirdCell   = cells[i + 2];
        let fourthCell  = cells[i + 3];
        let fifthCell   = cells[i + 4];
        
  
        // Obtem os valores das células
        let firstValues  = getCellValues(firstCell);
        let secondValues = getCellValues(secondCell);
        let thirdValues  = getCellValues(thirdCell);
        let fourthValues = getCellValues(fourthCell);
        let fifthValues  = getCellValues(fifthCell);
        
        // Arrays para armazenar os valores que combinam usando um conjunto para evitar duplicatas
        let intersectingValues = new Set();
  
       // Itera sobre os valores da 1ª até 5ª células
       firstValues.forEach((firstValue) => {
          // Verifica se existe correspondente na  3ª célula
          if (secondValues.includes(firstValue) && parseFloat(firstValue) >= 4.00 || thirdValues.includes(firstValue) && parseFloat(firstValue) >= 4.00 || fourthValues.includes(firstValue) && parseFloat(firstValue) >= 4.00 || fifthValues.includes(firstValue) && parseFloat(firstValue) >= 4.00 ) {
            intersectingValues.add(firstValue);
          }
        });
        secondValues.forEach((secondValue) => {
            // Verifica se existe correspondente na  3ª célula
            if (thirdValues.includes(secondValue) && parseFloat(secondValue) >= 4.00|| fourthValues.includes(secondValue)  && parseFloat(secondValue) >= 4.00|| fifthValues.includes(secondValue) && parseFloat(secondValue) >= 4.00) {
              intersectingValues.add(secondValue);
            }
          });
          thirdValues.forEach((thirdValue) => {
            // Verifica se existe correspondente na  3ª célula
            if (fourthValues.includes(thirdValue) && parseFloat(thirdValue) >= 4.00 || fifthValues.includes(thirdValue) && parseFloat(thirdValue) >= 4.00) {
              intersectingValues.add(thirdValue);
            }
          });
          fourthValues.forEach((fourthValue) => {
            // Verifica se existe correspondente na  3ª célula
            if (fifthValues.includes(fourthValue) && parseFloat(fourthValue) >= 4.00) {
              intersectingValues.add(fourthValue);
            }
          });
        // Verifica se há mais de 2 valores no array intersectingValues
        if (intersectingValues.size >= 2) {
            let nova_mensagem = `Padrão 1ª à 5ª torre: \n1ª${firstValues} \n2ª${secondValues} \n3ª${thirdValues} \n4ª${fourthValues} \n5ª${fifthValues} \nPadrões: ${Array.from(intersectingValues)}`
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
  