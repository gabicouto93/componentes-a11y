const contatoForm = document.querySelector('form[action="https://formspree.io/f/xjgdvnrv"]');
const formStatus = document.getElementById("form-status");

function atualizarStatus(mensagem, tipo) {
    if (!formStatus) {
        return;
    }

    formStatus.textContent = mensagem;
    formStatus.dataset.status = tipo;
}

function definirErro(campo, elementoErro, mensagem) {
    if (!campo || !elementoErro) {
        return;
    }

    campo.setAttribute("aria-invalid", "true");
    elementoErro.textContent = mensagem;
}

function limparErro(campo, elementoErro) {
    if (!campo || !elementoErro) {
        return;
    }

    campo.removeAttribute("aria-invalid");
    elementoErro.textContent = "";
}

function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarFormulario() {
    if (!contatoForm) {
        return false;
    }

    const nome = contatoForm.elements.nome;
    const email = contatoForm.elements.email;
    const mensagem = contatoForm.elements.mensagem;

    const erroNome = document.getElementById("erro-nome");
    const erroEmail = document.getElementById("erro-email");
    const erroMensagem = document.getElementById("erro-mensagem");

    limparErro(nome, erroNome);
    limparErro(email, erroEmail);
    limparErro(mensagem, erroMensagem);
    atualizarStatus("", "");

    let formularioValido = true;

    if (!nome.value.trim()) {
        definirErro(nome, erroNome, "Informe seu nome completo.");
        formularioValido = false;
    }

    if (!email.value.trim()) {
        definirErro(email, erroEmail, "Informe seu e-mail.");
        formularioValido = false;
    } else if (!validarEmail(email.value.trim())) {
        definirErro(email, erroEmail, "Digite um e-mail em formato válido.");
        formularioValido = false;
    }

    if (!mensagem.value.trim()) {
        definirErro(mensagem, erroMensagem, "Escreva a mensagem antes de enviar.");
        formularioValido = false;
    }

    if (!formularioValido) {
        atualizarStatus("Há erros no formulário. Revise os campos destacados.", "erro");

        const primeiroErro = contatoForm.querySelector('[aria-invalid="true"]');

        if (primeiroErro) {
            primeiroErro.focus();
        }

        return false;
    }

    return true;
}

async function enviarFormulario(event) {
    event.preventDefault();

    if (!contatoForm || !validarFormulario()) {
        return;
    }

    const botaoEnviar = contatoForm.querySelector('button[type="submit"]');
    const dadosFormulario = new FormData(contatoForm);
    const urlObrigado = new URL("obrigado.html", window.location.href).toString();

    if (botaoEnviar) {
        botaoEnviar.disabled = true;
    }

    atualizarStatus("enviando mensagem.", "sucesso");

    try {
        const resposta = await fetch(contatoForm.action, {
            method: "POST",
            headers: {
                Accept: "application/json"
            },
            body: dadosFormulario
        });

        if (resposta.ok) {
            atualizarStatus("Mensagem enviada com sucesso. Redirecionando...", "sucesso");
            window.location.assign(urlObrigado);
            return;
        }

        const dadosErro = await resposta.json().catch(() => null);
        const mensagemErro = dadosErro?.errors?.[0]?.message || "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.";

        atualizarStatus(mensagemErro, "erro");
    } catch (erro) {
        atualizarStatus("Falha de conexão ao enviar o formulário. Tente novamente.", "erro");
    } finally {
        if (botaoEnviar) {
            botaoEnviar.disabled = false;
        }
    }
}

if (contatoForm) {
    contatoForm.addEventListener("submit", enviarFormulario);
}