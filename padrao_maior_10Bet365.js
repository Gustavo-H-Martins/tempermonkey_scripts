// ==UserScript==
// @name         padrao_maior_10Bet365
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
  const delay = 500;
  let lastSentMessage = "ultimaMensagem";
  let mensagem = ""
  const token = "6747759570:AAFw4-rtwKN0kG5zGYdO8db397kSyrDGMBQ";
  const chat_id = "5754261195";

  function sendMessage(text) {
    lastSentMessage = text;
    mensagem = `Valor maior que 10 ${text}`
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `chat_id=${chat_id}&text=${encodeURIComponent(mensagem)}`,
      onload: function (response) {
        console.log("Response received from Telegram:", response.responseText);
      },
      onerror: function (response) {
        console.error("Error sending message:", response.responseText);
      },
    });
  }

  function checkForNewColumn() {
    let rows = document.querySelectorAll(
      "body > app-root > app-horarios > main > section > div.row.d-flex.justify-content-around.mt-1 > div.col-md-10.mt-6 > table > tbody > tr:nth-child(1)"
    );

    rows.forEach((row) => {
      let cells = row.querySelectorAll("td.SemDados > div > p");
      let filledCells = Array.from(cells).filter(
        (cell) => cell.innerText.trim() !== ""
      );

      if (filledCells.length > 0) {
        let ultimateCell = filledCells[filledCells.length - 1];

        if (ultimateCell.innerText.trim() != lastSentMessage) {
          // Seleciona todos os elementos span dentro da célula atual
          let spanElements = ultimateCell.querySelectorAll("span");

          // Array para armazenar os valores da célula atual
          let currentValues = [];

          // Itera sobre os elementos span e obtém o texto de cada um
          spanElements.forEach((span) => {
            currentValues.push(span.textContent.trim());
          });
          // Dicionário para armazenar os valores da célula atual

          currentValues.forEach((currentValue) => {
              // Verifica se o valor é maior que 10
              if (parseFloat(currentValue) > 9.9) {
                      console.log(`Valor maior que 10 ${currentValue}`);
                      sendMessage(ultimateCell.innerText.trim());
              }
          });
        }
      }
    });
  }

  setInterval(checkForNewColumn, delay);
})();
