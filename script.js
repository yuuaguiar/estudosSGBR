const botaoMenu = document.querySelector('#botao-menu');
const menuPrincipal = document.querySelector('#menu-principal');
const linksDoMenu = document.querySelectorAll('#menu-principal a');
const cabecalhoFixo = document.querySelector('header');

const alternarMenuNoCelular = () => {
    if (!botaoMenu || !menuPrincipal) {
        return;
    }

    const menuEstaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';

    botaoMenu.setAttribute('aria-expanded', String(!menuEstaAberto));
    menuPrincipal.classList.toggle('hidden');
};

const fecharMenuNoCelular = () => {
    if (!botaoMenu || !menuPrincipal) {
        return;
    }

    botaoMenu.setAttribute('aria-expanded', 'false');
    menuPrincipal.classList.add('hidden');
};

const calcularAlturaDoCabecalho = () => {
    return cabecalhoFixo ? cabecalhoFixo.offsetHeight : 0;
};

const secoesDoMenu = Array.from(linksDoMenu)
    .map(linkDoMenu => {
        const alvoDoLink = linkDoMenu.getAttribute('href');

        if (!alvoDoLink || !alvoDoLink.startsWith('#')) {
            return null;
        }

        const secaoEncontrada = document.querySelector(alvoDoLink);
        return secaoEncontrada ? { linkDoMenu, secaoEncontrada } : null;
    })
    .filter(Boolean)
    .sort((primeiroItem, segundoItem) => primeiroItem.secaoEncontrada.offsetTop - segundoItem.secaoEncontrada.offsetTop);

const aplicarEstiloDoLink = (linkDoMenu, estaAtivo = false) => {
    linkDoMenu.style.color = estaAtivo ? '#0ea5e9' : '#475569';
    linkDoMenu.style.fontWeight = estaAtivo ? '700' : '400';
    linkDoMenu.style.transition = 'color 0.3s ease, font-weight 0.3s ease';
};

const atualizarLinkAtivo = () => {
    const posicaoAtualDaTela = window.scrollY + calcularAlturaDoCabecalho() + 90;
    const chegouAoFinalDaPagina = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const ultimaSecaoDoMenu = secoesDoMenu[secoesDoMenu.length - 1];

    const secaoAtiva = chegouAoFinalDaPagina && ultimaSecaoDoMenu
        ? ultimaSecaoDoMenu
        : secoesDoMenu.reduce((secaoAtual, itemDoMenu) => {
            return posicaoAtualDaTela >= itemDoMenu.secaoEncontrada.offsetTop ? itemDoMenu : secaoAtual;
        }, null);

    linksDoMenu.forEach(linkDoMenu => {
        const linkEstaAtivo = secaoAtiva && linkDoMenu === secaoAtiva.linkDoMenu;
        aplicarEstiloDoLink(linkDoMenu, linkEstaAtivo);
    });
};

secoesDoMenu.forEach(({ linkDoMenu, secaoEncontrada }) => {
    linkDoMenu.addEventListener('mouseenter', () => aplicarEstiloDoLink(linkDoMenu, true));
    linkDoMenu.addEventListener('mouseleave', atualizarLinkAtivo);

    linkDoMenu.addEventListener('click', eventoDoClique => {
        eventoDoClique.preventDefault();

        const posicaoAjustadaDaSecao = secaoEncontrada.getBoundingClientRect().top + window.scrollY - calcularAlturaDoCabecalho() - 16;

        window.scrollTo({
            top: posicaoAjustadaDaSecao,
            behavior: 'smooth'
        });

        if (window.innerWidth < 768) {
            fecharMenuNoCelular();
        }
    });
});

let existeAtualizacaoPendente = false;

const agendarAtualizacaoDoMenu = () => {
    if (existeAtualizacaoPendente) {
        return;
    }

    existeAtualizacaoPendente = true;

    window.requestAnimationFrame(() => {
        atualizarLinkAtivo();
        existeAtualizacaoPendente = false;
    });
};

if (botaoMenu) {
    botaoMenu.addEventListener('click', alternarMenuNoCelular);
}

window.addEventListener('resize', () => {
    atualizarLinkAtivo();

    if (window.innerWidth >= 768 && menuPrincipal) {
        menuPrincipal.classList.remove('hidden');
    }

    if (window.innerWidth < 768 && menuPrincipal && botaoMenu && botaoMenu.getAttribute('aria-expanded') !== 'true') {
        menuPrincipal.classList.add('hidden');
    }
});

window.addEventListener('scroll', agendarAtualizacaoDoMenu, { passive: true });

if (window.innerWidth >= 768 && menuPrincipal) {
    menuPrincipal.classList.remove('hidden');
}

atualizarLinkAtivo();

const aplicarEfeitoNosCartoes = (seletorDosCartoes, configuracao = {}) => {
    const cartoesDaPagina = document.querySelectorAll(seletorDosCartoes);
    const sombraInicial = configuracao.sombraInicial || '';
    const sombraQuandoAtivo = configuracao.sombraAtiva || '0 14px 30px rgba(15, 23, 42, 0.16)';
    const movimentoDoCartao = configuracao.movimento || 'translateY(-6px)';

    cartoesDaPagina.forEach(cartaoDaPagina => {
        const imagemDoCartao = cartaoDaPagina.querySelector('img');

        cartaoDaPagina.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        cartaoDaPagina.style.cursor = 'pointer';

        if (imagemDoCartao) {
            imagemDoCartao.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        }

        cartaoDaPagina.addEventListener('mouseenter', () => {
            cartaoDaPagina.style.transform = movimentoDoCartao;
            cartaoDaPagina.style.boxShadow = sombraQuandoAtivo;

            if (imagemDoCartao) {
                imagemDoCartao.style.transform = 'scale(1.04)';
                imagemDoCartao.style.filter = 'brightness(1.04)';
            }
        });

        cartaoDaPagina.addEventListener('mouseleave', () => {
            cartaoDaPagina.style.transform = 'translateY(0)';
            cartaoDaPagina.style.boxShadow = sombraInicial;

            if (imagemDoCartao) {
                imagemDoCartao.style.transform = 'scale(1)';
                imagemDoCartao.style.filter = 'brightness(1)';
            }
        });
    });
};

aplicarEfeitoNosCartoes('.cartao-quarto', {
    sombraAtiva: '0 12px 26px rgba(79, 179, 163, 0.25)'
});

aplicarEfeitoNosCartoes('.cartao-sobre', {
    sombraInicial: '0 10px 15px rgba(0, 0, 0, 0.10)',
    sombraAtiva: '0 16px 30px rgba(15, 23, 42, 0.18)'
});

aplicarEfeitoNosCartoes('.cartao-contato', {
    movimento: 'translateY(-4px)',
    sombraAtiva: '0 10px 18px rgba(2, 68, 16, 0.20)'
});

const formularioDeAcesso = document.querySelector('#formulario-acesso-hospede');
const avisoDoLogin = document.querySelector('#aviso-login');
const camposDeLogin = document.querySelectorAll('.campo-de-login');
const botaoPrincipalDoLogin = document.querySelector('.botao-principal-login');

camposDeLogin.forEach(campoDeLogin => {
    campoDeLogin.addEventListener('focus', () => {
        campoDeLogin.style.borderColor = '#4fb3a3';
        campoDeLogin.style.boxShadow = '0 0 0 3px rgba(79, 179, 163, 0.18)';
    });

    campoDeLogin.addEventListener('blur', () => {
        campoDeLogin.style.borderColor = '#cbd5e1';
        campoDeLogin.style.boxShadow = 'none';
    });
});

if (botaoPrincipalDoLogin) {
    const sombraPadraoDoBotao = '0 10px 22px rgba(47, 159, 143, 0.35)';
    const sombraAtivaDoBotao = '0 14px 28px rgba(47, 159, 143, 0.45)';

    botaoPrincipalDoLogin.style.transition = 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease';
    botaoPrincipalDoLogin.style.boxShadow = sombraPadraoDoBotao;

    botaoPrincipalDoLogin.addEventListener('mouseenter', () => {
        botaoPrincipalDoLogin.style.transform = 'translateY(-3px) scale(1.02)';
        botaoPrincipalDoLogin.style.backgroundColor = '#247f72';
        botaoPrincipalDoLogin.style.boxShadow = sombraAtivaDoBotao;
    });

    botaoPrincipalDoLogin.addEventListener('mouseleave', () => {
        botaoPrincipalDoLogin.style.transform = 'translateY(0)';
        botaoPrincipalDoLogin.style.backgroundColor = '#2f9f8f';
        botaoPrincipalDoLogin.style.boxShadow = sombraPadraoDoBotao;
    });
}

if (formularioDeAcesso && avisoDoLogin) {
    formularioDeAcesso.addEventListener('submit', eventoDeEnvio => {
        eventoDeEnvio.preventDefault();

        const emailDigitado = document.querySelector('#campo-email-hospede').value.trim();
        const senhaDigitada = document.querySelector('#campo-senha-hospede').value.trim();

        if (!emailDigitado || senhaDigitada.length < 6) {
            avisoDoLogin.textContent = 'Preencha o e-mail e uma senha com pelo menos 6 caracteres.';
            avisoDoLogin.style.color = '#b91c1c';
            return;
        }

        avisoDoLogin.textContent = 'Login recebido. Em breve essa área poderá mostrar reservas e agendamentos.';
        avisoDoLogin.style.color = '#047857';
    });
}
