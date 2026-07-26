const botaoSim = document.querySelector("#botao-sim");
const botaoNao = document.querySelector("#botao-nao");

const botaoContinuar = document.querySelector(
  "#botao-continuar",
);

const botaoContinuarHorario = document.querySelector(
  "#botao-continuar-horario",
);

const voltarInicio = document.querySelector("#voltar-inicio");
const voltarData = document.querySelector("#voltar-data");
const voltarHorario = document.querySelector(
  "#voltar-horario",
);

const telaInicial = document.querySelector("#tela-inicial");
const telaData = document.querySelector("#tela-data");
const telaHorario = document.querySelector("#tela-horario");
const telaComida = document.querySelector("#tela-comida");
const telaFinal = document.querySelector("#tela-final");

const dataEncontro = document.querySelector("#data-encontro");

const horarioEncontro = document.querySelector(
  "#horario-encontro",
);

const opcoesComida = document.querySelectorAll(
  ".opcao-comida",
);

const resumoData = document.querySelector("#resumo-data");
const resumoHorario = document.querySelector(
  "#resumo-horario",
);
const resumoComida = document.querySelector(
  "#resumo-comida",
);

const botaoWhatsapp = document.querySelector(
  "#botao-whatsapp",
);

const musicaFundo = document.querySelector("#musica-fundo");

const controleMusica = document.querySelector(
  "#controle-musica",
);

let dataEscolhida = "";
let horarioEscolhido = "";
let comidaEscolhida = "";

/* Configuração da data mínima */

const hoje = new Date();

const anoAtual = hoje.getFullYear();

const mesAtual = String(hoje.getMonth() + 1).padStart(
  2,
  "0",
);

const diaAtual = String(hoje.getDate()).padStart(2, "0");

const dataMinima = `${anoAtual}-${mesAtual}-${diaAtual}`;

dataEncontro.min = dataMinima;

/* Criação dos horários */

function adicionarHorarios() {
  const horaInicial = 8;
  const horaFinal = 23;
  const intervaloMinutos = 30;

  for (
    let hora = horaInicial;
    hora <= horaFinal;
    hora++
  ) {
    for (
      let minuto = 0;
      minuto < 60;
      minuto += intervaloMinutos
    ) {
      const horaFormatada = String(hora).padStart(
        2,
        "0",
      );

      const minutoFormatado = String(minuto).padStart(
        2,
        "0",
      );

      const horario = `${horaFormatada}:${minutoFormatado}`;

      const opcao = document.createElement("option");

      opcao.value = horario;
      opcao.textContent = horario;

      horarioEncontro.appendChild(opcao);
    }
  }
}

adicionarHorarios();

/* Funções gerais */

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function mostrarTela(telaAtual, proximaTela) {
  telaAtual.classList.add("escondida");
  proximaTela.classList.remove("escondida");
}

/* Movimento suave do botão Não */

let botaoNaoPreparado = false;
let espacoBotaoNao = null;

let posicaoInicialX = 0;
let posicaoInicialY = 0;

let larguraBotaoNao = 0;
let alturaBotaoNao = 0;

let deslocamentoX = 0;
let deslocamentoY = 0;

let velocidadeX = 0;
let velocidadeY = 0;

let ponteiroX = -10000;
let ponteiroY = -10000;

let ultimoTempo = null;

function prepararBotaoNao() {
  if (botaoNaoPreparado) {
    return;
  }

  const posicao = botaoNao.getBoundingClientRect();

  posicaoInicialX = posicao.left;
  posicaoInicialY = posicao.top;

  larguraBotaoNao = posicao.width;
  alturaBotaoNao = posicao.height;

  espacoBotaoNao = document.createElement("span");

  espacoBotaoNao.style.width = `${larguraBotaoNao}px`;
  espacoBotaoNao.style.height = `${alturaBotaoNao}px`;
  espacoBotaoNao.style.display = "block";
  espacoBotaoNao.style.flexShrink = "0";

  botaoNao.insertAdjacentElement(
    "afterend",
    espacoBotaoNao,
  );

  botaoNao.style.position = "fixed";
  botaoNao.style.left = `${posicaoInicialX}px`;
  botaoNao.style.top = `${posicaoInicialY}px`;
  botaoNao.style.width = `${larguraBotaoNao}px`;
  botaoNao.style.height = `${alturaBotaoNao}px`;
  botaoNao.style.margin = "0";

  botaoNaoPreparado = true;
}

function atualizarPonteiro(evento) {
  ponteiroX = evento.clientX;
  ponteiroY = evento.clientY;
}

function animarBotaoNao(tempoAtual) {
  if (ultimoTempo === null) {
    ultimoTempo = tempoAtual;
  }

  const deltaTempo = Math.min(
    (tempoAtual - ultimoTempo) / 1000,
    0.033,
  );

  ultimoTempo = tempoAtual;

  if (!telaInicial.classList.contains("escondida")) {
    prepararBotaoNao();

    const posicaoX = posicaoInicialX + deslocamentoX;
    const posicaoY = posicaoInicialY + deslocamentoY;

    const centroBotaoX =
      posicaoX + larguraBotaoNao / 2;

    const centroBotaoY =
      posicaoY + alturaBotaoNao / 2;

    let forcaX = 0;
    let forcaY = 0;

    let distanciaX = centroBotaoX - ponteiroX;
    let distanciaY = centroBotaoY - ponteiroY;

    let distanciaPonteiro = Math.hypot(
      distanciaX,
      distanciaY,
    );

    const raioDeFuga = 230;

    if (distanciaPonteiro < raioDeFuga) {
      if (distanciaPonteiro < 1) {
        distanciaX = 1;
        distanciaY = -1;

        distanciaPonteiro = Math.hypot(
          distanciaX,
          distanciaY,
        );
      }

      const direcaoX =
        distanciaX / distanciaPonteiro;

      const direcaoY =
        distanciaY / distanciaPonteiro;

      const proximidade =
        1 - distanciaPonteiro / raioDeFuga;

      const aceleracao =
        950 + proximidade * proximidade * 3600;

      forcaX += direcaoX * aceleracao;
      forcaY += direcaoY * aceleracao;
    }

    const margem = 15;
    const zonaDaBorda = 90;
    const forcaDaBorda = 4000;

    const limiteDireito =
      window.innerWidth - larguraBotaoNao - margem;

    const limiteInferior =
      window.innerHeight - alturaBotaoNao - margem;

    const distanciaBordaEsquerda =
      posicaoX - margem;

    const distanciaBordaDireita =
      limiteDireito - posicaoX;

    const distanciaBordaSuperior =
      posicaoY - margem;

    const distanciaBordaInferior =
      limiteInferior - posicaoY;

    if (distanciaBordaEsquerda < zonaDaBorda) {
      const proximidade =
        1 - distanciaBordaEsquerda / zonaDaBorda;

      forcaX +=
        forcaDaBorda * proximidade * proximidade;
    }

    if (distanciaBordaDireita < zonaDaBorda) {
      const proximidade =
        1 - distanciaBordaDireita / zonaDaBorda;

      forcaX -=
        forcaDaBorda * proximidade * proximidade;
    }

    if (distanciaBordaSuperior < zonaDaBorda) {
      const proximidade =
        1 - distanciaBordaSuperior / zonaDaBorda;

      forcaY +=
        forcaDaBorda * proximidade * proximidade;
    }

    if (distanciaBordaInferior < zonaDaBorda) {
      const proximidade =
        1 - distanciaBordaInferior / zonaDaBorda;

      forcaY -=
        forcaDaBorda * proximidade * proximidade;
    }

    velocidadeX += forcaX * deltaTempo;
    velocidadeY += forcaY * deltaTempo;

    const atrito = Math.exp(-3.2 * deltaTempo);

    velocidadeX *= atrito;
    velocidadeY *= atrito;

    const velocidadeAtual = Math.hypot(
      velocidadeX,
      velocidadeY,
    );

    const velocidadeMaxima = 980;

    if (velocidadeAtual > velocidadeMaxima) {
      const proporcao =
        velocidadeMaxima / velocidadeAtual;

      velocidadeX *= proporcao;
      velocidadeY *= proporcao;
    }

    deslocamentoX += velocidadeX * deltaTempo;
    deslocamentoY += velocidadeY * deltaTempo;

    let novaPosicaoX =
      posicaoInicialX + deslocamentoX;

    let novaPosicaoY =
      posicaoInicialY + deslocamentoY;

    if (novaPosicaoX < margem) {
      novaPosicaoX = margem;

      deslocamentoX = margem - posicaoInicialX;

      velocidadeX = Math.max(0, velocidadeX);
    }

    if (novaPosicaoX > limiteDireito) {
      novaPosicaoX = limiteDireito;

      deslocamentoX =
        limiteDireito - posicaoInicialX;

      velocidadeX = Math.min(0, velocidadeX);
    }

    if (novaPosicaoY < margem) {
      novaPosicaoY = margem;

      deslocamentoY = margem - posicaoInicialY;

      velocidadeY = Math.max(0, velocidadeY);
    }

    if (novaPosicaoY > limiteInferior) {
      novaPosicaoY = limiteInferior;

      deslocamentoY =
        limiteInferior - posicaoInicialY;

      velocidadeY = Math.min(0, velocidadeY);
    }

    botaoNao.style.transform = `translate3d(
      ${deslocamentoX}px,
      ${deslocamentoY}px,
      0
    )`;
  }

  requestAnimationFrame(animarBotaoNao);
}

function restaurarBotaoNao() {
  botaoNao.style.position = "";
  botaoNao.style.left = "";
  botaoNao.style.top = "";
  botaoNao.style.width = "";
  botaoNao.style.height = "";
  botaoNao.style.margin = "";
  botaoNao.style.transform = "";

  if (espacoBotaoNao !== null) {
    espacoBotaoNao.remove();
    espacoBotaoNao = null;
  }

  deslocamentoX = 0;
  deslocamentoY = 0;

  velocidadeX = 0;
  velocidadeY = 0;

  ponteiroX = -10000;
  ponteiroY = -10000;

  ultimoTempo = null;
  botaoNaoPreparado = false;
}

document.addEventListener(
  "pointermove",
  atualizarPonteiro,
  {
    passive: true,
  },
);

document.addEventListener(
  "pointerdown",
  atualizarPonteiro,
  {
    passive: true,
  },
);

requestAnimationFrame(animarBotaoNao);

/* Eventos das telas */

botaoSim.addEventListener("click", function () {
  mostrarTela(telaInicial, telaData);

  musicaFundo.volume = 0.25;

  musicaFundo
    .play()
    .then(function () {
      controleMusica.classList.remove("escondida");
    })
    .catch(function () {
      console.log("O navegador não permitiu iniciar o áudio.");
    });
});

botaoContinuar.addEventListener("click", function () {
  if (dataEncontro.value === "") {
    alert("Escolha uma data antes de continuar.");
    return;
  }

  if (dataEncontro.value < dataMinima) {
    alert("Escolha uma data que ainda não passou.");
    return;
  }

  dataEscolhida = dataEncontro.value;

  mostrarTela(telaData, telaHorario);
});

botaoContinuarHorario.addEventListener(
  "click",
  function () {
    if (horarioEncontro.value === "") {
      alert(
        "Escolha um horário antes de continuar.",
      );

      return;
    }

    horarioEscolhido = horarioEncontro.value;

    mostrarTela(telaHorario, telaComida);
  },
);

opcoesComida.forEach(function (botao) {
  botao.addEventListener("click", function () {
    comidaEscolhida = botao.dataset.comida;

    resumoData.textContent =
      formatarData(dataEscolhida);

    resumoHorario.textContent =
      horarioEscolhido;

    resumoComida.textContent = comidaEscolhida;

    mostrarTela(telaComida, telaFinal);
  });
});

voltarInicio.addEventListener("click", function () {
  restaurarBotaoNao();

  mostrarTela(telaData, telaInicial);
});

voltarData.addEventListener("click", function () {
  mostrarTela(telaHorario, telaData);
});

voltarHorario.addEventListener("click", function () {
  mostrarTela(telaComida, telaHorario);
});

botaoWhatsapp.addEventListener(
  "click",
  function () {
    const dataFormatada =
      formatarData(dataEscolhida);

    const mensagem = `Está marcado! 

📅 Data: ${dataFormatada}
⏰ Horário: ${horarioEscolhido}
🍽️ Comida: ${comidaEscolhida}`;

    const mensagemCodificada =
      encodeURIComponent(mensagem);

    const linkWhatsapp =
      `https://wa.me/?text=${mensagemCodificada}`;

    window.open(linkWhatsapp, "_blank");
  },
);

controleMusica.addEventListener("click", function () {
  if (musicaFundo.paused) {
    musicaFundo.play();

    controleMusica.textContent = "🔊";
    controleMusica.setAttribute(
      "aria-label",
      "Pausar música",
    );
    controleMusica.title = "Pausar música";
  } else {
    musicaFundo.pause();

    controleMusica.textContent = "🔇";
    controleMusica.setAttribute(
      "aria-label",
      "Continuar música",
    );
    controleMusica.title = "Continuar música";
  }
});