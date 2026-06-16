// Interação dos links do menu de navegação
const linksMenu = document.querySelectorAll('nav a');
const cabecalho = document.querySelector('.fixed');

const secoesMenu = Array.from(linksMenu)
    .map(link => {
        const secao = document.querySelector(link.getAttribute('href'));
        return secao ? { link, secao } : null;
    })
    .filter(Boolean)
    .sort((primeiro, segundo) => primeiro.secao.offsetTop - segundo.secao.offsetTop);

const aplicarEstiloLink = (link, ativo = false) => {
    link.style.color = ativo ? '#0ea5e9' : '#4b5563';
    link.style.fontWeight = ativo ? '600' : '400';
    link.style.transition = 'color 0.3s ease, font-weight 0.3s ease';
};

const calcularAlturaCabecalho = () => (cabecalho ? cabecalho.offsetHeight : 0);

const atualizarLinkAtivo = () => {
    const posicaoAtual = window.scrollY + calcularAlturaCabecalho() + 90;
    const chegouNoFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const ultimaSecao = secoesMenu[secoesMenu.length - 1];
    const secaoAtiva = chegouNoFinal && ultimaSecao ? ultimaSecao : secoesMenu.reduce((atual, item) => {
        return posicaoAtual >= item.secao.offsetTop ? item : atual;
    }, null);

    linksMenu.forEach(link => aplicarEstiloLink(link, secaoAtiva && link === secaoAtiva.link));
};

secoesMenu.forEach(({ link, secao }) => {
    link.addEventListener('mouseenter', () => aplicarEstiloLink(link, true));
    link.addEventListener('mouseleave', atualizarLinkAtivo);

    link.addEventListener('click', evento => {
        evento.preventDefault();

        window.scrollTo({
            top: secao.getBoundingClientRect().top + window.scrollY - calcularAlturaCabecalho() - 16,
            behavior: 'smooth'
        });
    });
});

let atualizacaoPendente = false;

const agendarAtualizacaoMenu = () => {
    if (atualizacaoPendente) {
        return;
    }

    atualizacaoPendente = true;
    window.requestAnimationFrame(() => {
        atualizarLinkAtivo();
        atualizacaoPendente = false;
    });
};

window.addEventListener('scroll', agendarAtualizacaoMenu, { passive: true });
window.addEventListener('resize', atualizarLinkAtivo);

atualizarLinkAtivo();

// Efeitos nos blocos da página
const aplicarEfeitoBloco = (seletor, configuracao = {}) => {
    const blocos = document.querySelectorAll(seletor);
    const sombraInicial = configuracao.sombraInicial || '';
    const sombraAtiva = configuracao.sombraAtiva || '0 14px 30px rgba(15, 23, 42, 0.16)';
    const movimento = configuracao.movimento || 'translateY(-6px)';

    blocos.forEach(bloco => {
        const imagem = bloco.querySelector('img');

        bloco.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        bloco.style.cursor = 'pointer';

        if (imagem) {
            imagem.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        }

        bloco.addEventListener('mouseenter', () => {
            bloco.style.transform = movimento;
            bloco.style.boxShadow = sombraAtiva;

            if (imagem) {
                imagem.style.transform = 'scale(1.04)';
                imagem.style.filter = 'brightness(1.04)';
            }
        });

        bloco.addEventListener('mouseleave', () => {
            bloco.style.transform = 'translateY(0)';
            bloco.style.boxShadow = sombraInicial;

            if (imagem) {
                imagem.style.transform = 'scale(1)';
                imagem.style.filter = 'brightness(1)';
            }
        });
    });
};

aplicarEfeitoBloco('.bloco-quarto', {
    sombraAtiva: '0 12px 26px rgba(79, 179, 163, 0.25)'
});

aplicarEfeitoBloco('.bloco-sobre', {
    sombraInicial: '0 10px 15px rgba(0, 0, 0, 0.10)',
    sombraAtiva: '0 16px 30px rgba(15, 23, 42, 0.18)'
});

aplicarEfeitoBloco('.bloco-contato', {
    movimento: 'translateY(-4px)',
    sombraAtiva: '0 10px 18px rgba(2, 68, 16, 0.20)'
});

// Login para uma futura área de reservas
const formularioLogin = document.querySelector('#formulario-login');
const mensagemLogin = document.querySelector('#mensagem-login');
const camposLogin = document.querySelectorAll('.campo-login');
const botaoLogin = document.querySelector('.botao-login');

camposLogin.forEach(campo => {
    campo.addEventListener('focus', () => {
        campo.style.borderColor = '#4fb3a3';
        campo.style.boxShadow = '0 0 0 3px rgba(79, 179, 163, 0.18)';
    });

    campo.addEventListener('blur', () => {
        campo.style.borderColor = '#d1d5db';
        campo.style.boxShadow = 'none';
    });
});

if (botaoLogin) {
    botaoLogin.style.transition = 'transform 0.3s ease, background-color 0.3s ease';

    botaoLogin.addEventListener('mouseenter', () => {
        botaoLogin.style.transform = 'translateY(-2px)';
        botaoLogin.style.backgroundColor = '#399b8b';
    });

    botaoLogin.addEventListener('mouseleave', () => {
        botaoLogin.style.transform = 'translateY(0)';
        botaoLogin.style.backgroundColor = '#4fb3a3';
    });
}

if (formularioLogin && mensagemLogin) {
    formularioLogin.addEventListener('submit', evento => {
        evento.preventDefault();

        const email = document.querySelector('#email-login').value.trim();
        const senha = document.querySelector('#senha-login').value.trim();

        if (!email || senha.length < 6) {
            mensagemLogin.textContent = 'Preencha o e-mail e uma senha com pelo menos 6 caracteres.';
            mensagemLogin.style.color = '#b91c1c';
            return;
        }

        mensagemLogin.textContent = 'Login recebido. Em breve essa área poderá mostrar reservas e agendamentos.';
        mensagemLogin.style.color = '#047857';
    });
}
