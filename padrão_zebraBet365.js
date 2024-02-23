// ==UserScript==
// @name         padrão_zebraBet365
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Esta função faz o envio de forma esporádica a cada 500 milisegundos de sinais bet 365
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
    let anteantepenultimo = "anteantepenultimo"
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
      for (let i = cells.length - 2; i >= 0; i--) {
        let currentCell = cells[i];
        let nextCell = cells[i + 1];
  
        // Seleciona todos os elementos span dentro da célula atual
        let spanElements = currentCell.querySelectorAll("span");
  
        // Array para armazenar os valores da célula atual
        let currentValues = [];
  
        // Itera sobre os elementos span e obtém o texto de cada um
        spanElements.forEach((span) => {
          currentValues.push(span.textContent.trim());
        });
  
        // Selecionar todos os elementos span dentro da célula seguinte
        let nextSpanElements = nextCell.querySelectorAll("span");
  
        // Array para armazenar os valores da célula seguinte
        let nextValues = [];
  
        // Iterar sobre os elementos span da célula seguinte e obter o texto de cada um
        nextSpanElements.forEach((span) => {
          nextValues.push(span.textContent.trim());
        });
  
        // Array para armazenar os valores que combinam usando um conjunto para evitar duplicatas
        let intersectingValues = new Set();
  
       // Iterar sobre os valores da célula atual
        currentValues.forEach((currentValue) => {
            //console.log(typeof currentValue)
          // Verificar se existe correspondente na célula seguinte e se não está bloqueado
          if (nextValues.includes(currentValue) && parseFloat(currentValue) > 4) {
            intersectingValues.add(currentValue);
          }
        });
  
        // Verifica se há mais de 2 valores no array intersectingValues e se os valores são diferentes
        if (intersectingValues.size >= 1) {
            let nova_mensagem = `Conjuntos no padrão Zebra: ${currentValues} e ${nextValues}`
            // TRAVA PARA ULTIMO E PENULTIMO PADRAO
            if (nova_mensagem != ultimoPadrao && ultimoPadrao != penultimoPadrao && nova_mensagem != penultimoPadrao && penultimoPadrao != antepenultimo && antepenultimo != anteantepenultimo) {
                /*
                console.log(`Último Padrâo: ${ultimoPadrao}`);
                console.log(`Penúltimo Padrão:${penultimoPadrao}`)
                console.log(`Antepenúltimo Padrão:${antepenultimo}`)
                */
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
  