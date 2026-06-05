(function () {
    "use strict";

    function converterParaNumeroOuTexto(valor) {
        var numero = Number(valor.replace(",", "."));

        if (!Number.isNaN(numero) && valor !== "") {
            return numero;
        }

        return valor.toLowerCase();
    }

    function atualizarAriaLabel(botao, nomeColuna, ordem) {
        botao.setAttribute("aria-label", "Ordenar por " + nomeColuna + ", ordem " + ordem);
    }

    function formatarOrdem(ordem) {
        return ordem === "padrao" ? "padrão" : ordem;
    }

    function obterIndiceColuna(botao) {
        var celulaCabecalho = botao.closest("th");

        if (!celulaCabecalho) {
            return -1;
        }

        return celulaCabecalho.cellIndex;
    }

    function ordenarTabela(tabela, chave, botaoClicado) {
        var tbody = tabela.tBodies[0];
        var linhas = Array.from(tbody.rows);
        var ordemAtual = botaoClicado.getAttribute("data-ordem-atual") || "padrao";
        var novaOrdem = ordemAtual === "padrao" ? "crescente" : ordemAtual === "crescente" ? "decrescente" : "padrao";
        var indiceColuna = obterIndiceColuna(botaoClicado);
        var ordenacaoBase = linhas.map(function (linha, indice) {
            return {
                linha: linha,
                valor: converterParaNumeroOuTexto(linha.dataset[chave] || (indiceColuna >= 0 ? linha.cells[indiceColuna].textContent.trim() : "")),
                indiceOriginal: indice
            };
        });

        if (novaOrdem === "padrao") {
            ordenacaoBase.sort(function (a, b) {
                return a.indiceOriginal - b.indiceOriginal;
            });
        } else {
            ordenacaoBase.sort(function (a, b) {
                if (a.valor < b.valor) {
                    return novaOrdem === "crescente" ? -1 : 1;
                }

                if (a.valor > b.valor) {
                    return novaOrdem === "crescente" ? 1 : -1;
                }

                return 0;
            });
        }

        ordenacaoBase.forEach(function (item) {
            tbody.appendChild(item.linha);
        });

        return novaOrdem;
    }

    function configurarTabelaOrdenavel() {
        var tabela = document.getElementById("tabela-ordenavel");
        var feedback = document.getElementById("feedback-ordenacao");

        if (!tabela || !feedback) {
            return;
        }

        var botoes = Array.from(tabela.querySelectorAll(".botao-ordenar"));

        botoes.forEach(function (botao) {
            var nomeColuna = botao.textContent.trim();
            var chave = botao.getAttribute("data-key");

            botao.setAttribute("data-ordem-atual", "padrao");
            atualizarAriaLabel(botao, nomeColuna, formatarOrdem("padrao"));

            botao.addEventListener("click", function () {
                var novaOrdem = ordenarTabela(tabela, chave, botao);
                var ordemFormatada = formatarOrdem(novaOrdem);

                if (novaOrdem === "crescente") {
                    feedback.textContent = "ordenação crescente aplicada";
                } else if (novaOrdem === "decrescente") {
                    feedback.textContent = "ordenação decrescente aplicada";
                } else {
                    feedback.textContent = "ordenação padrão aplicada";
                }

                botao.setAttribute("data-ordem-atual", novaOrdem);
                atualizarAriaLabel(botao, nomeColuna, ordemFormatada);
            });
        });
    }

    document.addEventListener("DOMContentLoaded", configurarTabelaOrdenavel);
})();
