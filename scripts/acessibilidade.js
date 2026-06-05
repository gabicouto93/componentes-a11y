(function () {
    "use strict";

    function obterNomePaginaAtual() {
        var caminho = window.location.pathname || "";
        var partes = caminho.split("/");
        return (partes[partes.length - 1] || "").toLowerCase();
    }

    function anunciarConteudoCarregado() {
        var liveRegion = document.createElement("div");
        liveRegion.setAttribute("role", "status");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.style.position = "absolute";
        liveRegion.style.width = "1px";
        liveRegion.style.height = "1px";
        liveRegion.style.padding = "0";
        liveRegion.style.margin = "-1px";
        liveRegion.style.overflow = "hidden";
        liveRegion.style.clip = "rect(0, 0, 0, 0)";
        liveRegion.style.whiteSpace = "nowrap";
        liveRegion.style.border = "0";
        liveRegion.textContent = "";

        document.body.appendChild(liveRegion);

        // Atualiza o texto após inserir no DOM para aumentar a chance de anúncio.
        setTimeout(function () {
            liveRegion.textContent = "Conteúdo carregado.";
        }, 60);

        setTimeout(function () {
            if (liveRegion.parentNode) {
                liveRegion.parentNode.removeChild(liveRegion);
            }
        }, 1060);
    }

    function focarAtalhoMenu() {
        var atalhoMenu = document.querySelector('#atalho-menu, header > ul a[href="#menu"], header a[href="#menu"]');

        if (atalhoMenu) {
            setTimeout(function () {
                atalhoMenu.focus();
            }, 30);
        }
    }

    function focarTituloPrincipal() {
        var tituloPrincipal = document.querySelector("h1");

        if (!tituloPrincipal) {
            return;
        }

        var tinhaTabindex = tituloPrincipal.hasAttribute("tabindex");
        var tabindexAnterior = tituloPrincipal.getAttribute("tabindex");
        var outlineAnterior = tituloPrincipal.style.outline;

        tituloPrincipal.setAttribute("tabindex", "-1");
        tituloPrincipal.style.outline = "none";
        tituloPrincipal.focus();

        setTimeout(function () {
            if (!tinhaTabindex) {
                tituloPrincipal.removeAttribute("tabindex");
            } else if (tabindexAnterior !== null) {
                tituloPrincipal.setAttribute("tabindex", tabindexAnterior);
            }

            tituloPrincipal.style.outline = outlineAnterior;
        }, 0);
    }

    function redirecionarSecoesLegadasComponentes() {
        var nomePagina = obterNomePaginaAtual();
        var hashAtual = (window.location.hash || "").toLowerCase();
        var caminhoAtual = window.location.pathname || "";
        var destinoPorHash = {
            "#links-botoes": "links-botoes.html",
            "#tabelas": "tabelas.html",
            "#formularios": "formularios.html"
        };

        if ((nomePagina !== "html.html" && nomePagina !== "texto, titulos, listas  e imagens.html") || !destinoPorHash[hashAtual]) {
            return;
        }

        var ultimaBarra = caminhoAtual.lastIndexOf("/");
        var caminhoBase = ultimaBarra >= 0 ? caminhoAtual.slice(0, ultimaBarra + 1) : "";
        window.location.replace(caminhoBase + destinoPorHash[hashAtual]);
    }

    window.addEventListener("load", function () {
        redirecionarSecoesLegadasComponentes();

        if (obterNomePaginaAtual() === "obrigado.html") {
            focarTituloPrincipal();
        } else {
            focarAtalhoMenu();
        }

        setTimeout(function () {
            anunciarConteudoCarregado();
        }, 120);
    });
})();
