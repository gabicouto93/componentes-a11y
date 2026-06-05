(function () {
    "use strict";

    function obterNomeComponente(botao) {
        var rotulo = botao.getAttribute("aria-label") || "";
        return rotulo.replace(/copiar c[oó]digo\s*/i, "").trim();
    }

    function copiarCodigo(event) {
        var botao = event.currentTarget;
        var targetId = botao.getAttribute("data-copy-target");
        var blocoCodigo = targetId ? document.getElementById(targetId) : null;

        if (!blocoCodigo) {
            return;
        }

        var codigo = blocoCodigo.textContent;

        navigator.clipboard.writeText(codigo).then(function () {
            var nomeComponente = obterNomeComponente(botao);
            var feedback = document.getElementById("feedback-" + targetId.replace("codigo-", ""));

            if (feedback) {
                feedback.textContent = "Código copiado para a área de transferência.";
                setTimeout(function () {
                    feedback.textContent = "";
                }, 2000);
            }

            botao.setAttribute("aria-label", "Copiado: código " + nomeComponente);

            setTimeout(function () {
                botao.setAttribute("aria-label", "Copiar código " + nomeComponente);
            }, 2000);
        }).catch(function () {
            var feedbackErro = document.getElementById("feedback-" + targetId.replace("codigo-", ""));

            if (feedbackErro) {
                feedbackErro.textContent = "Não foi possível copiar agora. Tente novamente.";
            }
        });
    }

    var botoes = document.querySelectorAll(".botao-copiar");

    botoes.forEach(function (botao) {
        botao.addEventListener("click", copiarCodigo);
    });
})();
