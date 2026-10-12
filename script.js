// --- SINTETIZADOR DE EFEITOS SONOROS (WEB AUDIO API) ---
let audioCtx = null;

function obterAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function tocarSomColetar() {
  try {
    const ctx = obterAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) { console.error(e); }
}

function tocarSomPerda() {
  try {
    const ctx = obterAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) { console.error(e); }
}

function tocarSomPop() {
  try {
    const ctx = obterAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freqInicial = 400 + Math.random() * 300;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqInicial, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) { console.error(e); }
}

function tocarSomClique() {
  try {
    const ctx = obterAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) { console.error(e); }
}

function tocarSomBandeira() {
  try {
    const ctx = obterAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.setValueAtTime(900, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) { console.error(e); }
}

function tocarSomExplosao() {
  try {
    const ctx = obterAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) { console.error(e); }
}

function tocarSomVitoria() {
  try {
    const ctx = obterAudioContext();
    const notas = [523.25, 659.25, 783.99, 1046.50];
    
    notas.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
    });
  } catch (e) { console.error(e); }
}

// --- SISTEMA DE TROCA DE TELAS ---
function mostrarTela(idTela) {
  obterAudioContext();
  
  document.querySelectorAll('.tela').forEach(tela => {
    tela.classList.remove('ativa');
  });
  
  const telaAtual = document.getElementById(idTela);
  if (telaAtual) {
    telaAtual.classList.add('ativa');
  }

  if (typeof loopCoracoes !== 'undefined') clearInterval(loopCoracoes);
  if (typeof intervalBaloes !== 'undefined') clearInterval(intervalBaloes);
  if (typeof timerBaloes !== 'undefined') clearInterval(timerBaloes);
  if (typeof loopCobrinha !== 'undefined') clearInterval(loopCobrinha);
  if (typeof animacaoCesta !== 'undefined') cancelAnimationFrame(animacaoCesta);

  if (idTela === 'jogo-coracoes') {
    iniciarJogoCoracoes();
  } else if (idTela === 'jogo-campo-minado') {
    iniciarCampoMinado();
  } else if (idTela === 'jogo-baloes') {
    iniciarJogoBaloes();
  } else if (idTela === 'jogo-cobrinha') {
    iniciarJogoCobrinha();
  }
}

function dispararTelaVitoria(mensagemPersonalizada) {
  if (typeof loopCoracoes !== 'undefined') clearInterval(loopCoracoes);
  if (typeof intervalBaloes !== 'undefined') clearInterval(intervalBaloes);
  if (typeof timerBaloes !== 'undefined') clearInterval(timerBaloes);
  if (typeof loopCobrinha !== 'undefined') clearInterval(loopCobrinha);
  if (typeof animacaoCesta !== 'undefined') cancelAnimationFrame(animacaoCesta);

  const elMsg = document.getElementById('mensagem-vitoria');
  if (elMsg && mensagemPersonalizada) {
    elMsg.innerText = mensagemPersonalizada;
  }

  tocarSomVitoria();
  mostrarTela('tela-vitoria');
}

function dispararTelaDerrotaCoracoes() {
  if (typeof loopCoracoes !== 'undefined') clearInterval(loopCoracoes);
  if (typeof animacaoCesta !== 'undefined') cancelAnimationFrame(animacaoCesta);
  jogoCoracoesAtivo = false;

  tocarSomPerda();
  mostrarTela('tela-derrota-coracoes');
}

function dispararTelaDerrotaMinado() {
  jogoFinalizado = true;
  tocarSomExplosao();
  revelarTodasMinas();
  setTimeout(() => {
    mostrarTela('tela-derrota-minado');
  }, 400);
}

function dispararTelaDerrotaBaloes() {
  if (typeof intervalBaloes !== 'undefined') clearInterval(intervalBaloes);
  if (typeof timerBaloes !== 'undefined') clearInterval(timerBaloes);
  jogoBaloesAtivo = false;

  tocarSomPerda();
  mostrarTela('tela-derrota-baloes');
}

function dispararTelaDerrotaCobrinha() {
  if (typeof loopCobrinha !== 'undefined') clearInterval(loopCobrinha);
  jogoCobrinhaAtivo = false;

  tocarSomPerda();
  mostrarTela('tela-derrota-cobrinha');
}

// --- JOGO 1: COLETAR CORAÇÕES ---
let pontuacaoCoracoes = 0;
const OBJETIVO_PONTOS = 5000;
let posicaoCesta = 45;
let loopCoracoes;
let animacaoCesta;
let teclasPressionadas = {};
let jogoCoracoesAtivo = false;

function iniciarJogoCoracoes() {
  pontuacaoCoracoes = 0;
  posicaoCesta = 45;
  jogoCoracoesAtivo = true;

  const placar = document.getElementById('placar-coracoes');
  if (placar) placar.innerText = `Score: ${pontuacaoCoracoes} / ${OBJETIVO_PONTOS}`;
  
  const cesta = document.getElementById('cesta');
  if (cesta) cesta.style.left = posicaoCesta + '%';

  if (loopCoracoes) clearInterval(loopCoracoes);
  document.querySelectorAll('.coracao-caindo').forEach(el => el.remove());

  loopCoracoes = setInterval(criarCoracao, 700);

  if (animacaoCesta) cancelAnimationFrame(animacaoCesta);
  atualizarMovimentoCesta();
}

document.addEventListener('keydown', (e) => {
  teclasPressionadas[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  teclasPressionadas[e.key.toLowerCase()] = false;
});

function atualizarMovimentoCesta() {
  const telaCoracoes = document.getElementById('jogo-coracoes');
  if (telaCoracoes && telaCoracoes.classList.contains('ativa') && jogoCoracoesAtivo) {
    const velocidade = 1.2;

    if (teclasPressionadas['a'] || teclasPressionadas['arrowleft']) {
      if (posicaoCesta > 0) posicaoCesta -= velocidade;
    }
    if (teclasPressionadas['d'] || teclasPressionadas['arrowright']) {
      if (posicaoCesta < 85) posicaoCesta += velocidade;
    }

    const cesta = document.getElementById('cesta');
    if (cesta) cesta.style.left = posicaoCesta + '%';

    animacaoCesta = requestAnimationFrame(atualizarMovimentoCesta);
  }
}

function criarCoracao() {
  const area = document.getElementById('area-jogo-coracoes');
  const telaCoracoes = document.getElementById('jogo-coracoes');
  
  if (!area || !telaCoracoes || !telaCoracoes.classList.contains('ativa') || !jogoCoracoesAtivo) return;

  const coracao = document.createElement('div');
  coracao.classList.add('coracao-caindo');
  
  const eRuim = pontuacaoCoracoes >= 200 && Math.random() < 0.25;

  const imgCoracao = document.createElement('img');
  imgCoracao.src = eRuim ? 'coracaoruim.png' : 'coracaobom.png';
  imgCoracao.alt = eRuim ? 'Coração Ruim' : 'Coração Bom';
  coracao.appendChild(imgCoracao);

  coracao.dataset.tipo = eRuim ? 'ruim' : 'bom';
  
  let posX = Math.floor(Math.random() * 85);
  let posY = 0;
  coracao.style.left = posX + '%';
  coracao.style.top = posY + 'px';
  area.appendChild(coracao);

  let queda = setInterval(() => {
    if (!jogoCoracoesAtivo) {
      clearInterval(queda);
      return;
    }

    posY += 4;
    coracao.style.top = posY + 'px';

    if (posY >= 275 && posY <= 325 && Math.abs(posX - posicaoCesta) < 10) {
      if (coracao.dataset.tipo === 'bom') {
        pontuacaoCoracoes += 50;
        tocarSomColetar();
      } else {
        pontuacaoCoracoes -= 100;
        tocarSomPerda();

        if (pontuacaoCoracoes <= 0) {
          pontuacaoCoracoes = 0;
          coracao.remove();
          clearInterval(queda);
          dispararTelaDerrotaCoracoes();
          return;
        }
      }

      const placar = document.getElementById('placar-coracoes');
      if (placar) placar.innerText = `Score: ${pontuacaoCoracoes} / ${OBJETIVO_PONTOS}`;
      
      coracao.remove();
      clearInterval(queda);

      if (pontuacaoCoracoes >= OBJETIVO_PONTOS && jogoCoracoesAtivo) {
        jogoCoracoesAtivo = false;
        setTimeout(() => {
          dispararTelaVitoria('Bet you cant catch deez nuts heh');
        }, 150);
      }
    }

    if (posY > 340) {
      coracao.remove();
      clearInterval(queda);
    }
  }, 25);
}

// --- JOGO 2: CAMPO MINADO CLÁSSICO ---
const LINHAS = 12;
const COLUNAS = 12;
const MINAS = 30;
let bandeirasColocadas = 0;
let matrizMinado = [];
let jogoFinalizado = false;
let primeiroClique = true;

function atualizarPlacarMinado() {
  const elBandeiras = document.getElementById('num-bandeiras');
  if (elBandeiras) {
    let bandeirasRestantes = MINAS - bandeirasColocadas;
    elBandeiras.innerText = bandeirasRestantes;
  }
}

function iniciarCampoMinado() {
  const tabuleiro = document.getElementById('tabuleiro-minado');
  if (!tabuleiro) return;

  tabuleiro.innerHTML = '';
  bandeirasColocadas = 0;
  atualizarPlacarMinado();
  
  jogoFinalizado = false;
  primeiroClique = true;
  matrizMinado = [];

  for (let r = 0; r < LINHAS; r++) {
    matrizMinado[r] = [];
    for (let c = 0; c < COLUNAS; c++) {
      matrizMinado[r][c] = {
        linha: r,
        coluna: c,
        mina: false,
        revelada: false,
        bandeira: false,
        vizinhos: 0,
        elemento: null
      };
    }
  }

  for (let r = 0; r < LINHAS; r++) {
    for (let c = 0; c < COLUNAS; c++) {
      const celula = document.createElement('div');
      celula.classList.add('celula-minada');
      
      const dadosCelula = matrizMinado[r][c];
      dadosCelula.elemento = celula;

      celula.addEventListener('click', () => tratarClique(dadosCelula));
      celula.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        colocarBandeira(dadosCelula);
      });

      tabuleiro.appendChild(celula);
    }
  }
}

function gerarMinas(linhaInicial, colunaInicial) {
  let minasColocadas = 0;
  
  while (minasColocadas < MINAS) {
    let r = Math.floor(Math.random() * LINHAS);
    let c = Math.floor(Math.random() * COLUNAS);
    
    let eEstrategiaSegura = Math.abs(r - linhaInicial) <= 1 && Math.abs(c - colunaInicial) <= 1;

    if (!matrizMinado[r][c].mina && !eEstrategiaSegura) {
      matrizMinado[r][c].mina = true;
      minasColocadas++;
    }
  }

  for (let r = 0; r < LINHAS; r++) {
    for (let c = 0; c < COLUNAS; c++) {
      if (matrizMinado[r][c].mina) continue;
      let contagem = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nr = r + dr;
          let nc = c + dc;
          if (nr >= 0 && nr < LINHAS && nc >= 0 && nc < COLUNAS) {
            if (matrizMinado[nr][nc].mina) contagem++;
          }
        }
      }
      matrizMinado[r][c].vizinhos = contagem;
    }
  }
}

function tratarClique(celula) {
  if (jogoFinalizado || celula.bandeira) return;

  if (primeiroClique) {
    gerarMinas(celula.linha, celula.coluna);
    primeiroClique = false;
  }

  revelarCelula(celula);
}

function revelarCelula(celula) {
  if (jogoFinalizado || celula.revelada || celula.bandeira) return;

  celula.revelada = true;
  celula.elemento.classList.add('revelada');

  if (celula.mina) {
    celula.elemento.classList.add('bomba');
    celula.elemento.innerHTML = '<img src="bomba.png" alt="Bomba">';
    dispararTelaDerrotaMinado();
    return;
  }

  tocarSomClique();

  if (celula.vizinhos > 0) {
    celula.elemento.innerText = celula.vizinhos;
    celula.elemento.classList.add(`num-${celula.vizinhos}`);
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        let nr = celula.linha + dr;
        let nc = celula.coluna + dc;
        if (nr >= 0 && nr < LINHAS && nc >= 0 && nc < COLUNAS) {
          revelarCelula(matrizMinado[nr][nc]);
        }
      }
    }
  }

  verificarVitoriaCampoMinado();
}

function colocarBandeira(celula) {
  if (jogoFinalizado || celula.revelada) return;

  tocarSomBandeira();

  if (!celula.bandeira) {
    if (bandeirasColocadas >= MINAS) return;

    celula.bandeira = true;
    celula.elemento.innerHTML = '<img src="bandeira.png" alt="Bandeira">';
    bandeirasColocadas++;
  } else {
    celula.bandeira = false;
    celula.elemento.innerHTML = '';
    bandeirasColocadas--;
  }

  atualizarPlacarMinado();
}

function revelarTodasMinas() {
  for (let r = 0; r < LINHAS; r++) {
    for (let c = 0; c < COLUNAS; c++) {
      let cell = matrizMinado[r][c];
      if (cell.mina) {
        cell.elemento.classList.add('revelada', 'bomba');
        cell.elemento.innerHTML = '<img src="bomba.png" alt="Bomba">';
      }
    }
  }
}

function verificarVitoriaCampoMinado() {
  let vitoria = true;
  for (let r = 0; r < LINHAS; r++) {
    for (let c = 0; c < COLUNAS; c++) {
      let cell = matrizMinado[r][c];
      if (!cell.mina && !cell.revelada) {
        vitoria = false;
      }
    }
  }

  if (vitoria) {
    jogoFinalizado = true;
    setTimeout(() => {
      dispararTelaVitoria('You really are an expert!');
    }, 200);
  }
}

// --- JOGO 3: BALÕES ---
let pontuacaoBaloes = 0;
let tempoRestanteBaloes = 30;
let intervalBaloes;
let timerBaloes;
let jogoBaloesAtivo = false;

function iniciarJogoBaloes() {
  pontuacaoBaloes = 0;
  tempoRestanteBaloes = 30;
  jogoBaloesAtivo = true;

  const placar = document.getElementById('placar-baloes');
  if (placar) placar.innerHTML = `Balloons: ${pontuacaoBaloes} / 20 | Timer: <span id="tempo-baloes">${tempoRestanteBaloes}</span>s`;

  const area = document.getElementById('area-jogo-baloes');
  if (!area) return;

  area.innerHTML = '';
  if (intervalBaloes) clearInterval(intervalBaloes);
  if (timerBaloes) clearInterval(timerBaloes);

  intervalBaloes = setInterval(criarBalao, 400);

  timerBaloes = setInterval(() => {
    if (!jogoBaloesAtivo) return;

    tempoRestanteBaloes--;
    const elTempo = document.getElementById('tempo-baloes');
    if (elTempo) elTempo.innerText = tempoRestanteBaloes;

    if (tempoRestanteBaloes <= 0) {
      jogoBaloesAtivo = false;
      clearInterval(intervalBaloes);
      clearInterval(timerBaloes);
      dispararTelaDerrotaBaloes();
    }
  }, 1000);
}

function criarBalao() {
  const area = document.getElementById('area-jogo-baloes');
  const telaBaloes = document.getElementById('jogo-baloes');

  if (!area || !telaBaloes || !telaBaloes.classList.contains('ativa') || !jogoBaloesAtivo) return;

  const balao = document.createElement('div');
  balao.classList.add('balao-container');

  const imgBalao = document.createElement('img');
  imgBalao.src = 'baloes.png';
  imgBalao.alt = 'Balão';
  balao.appendChild(imgBalao);

  balao.style.left = Math.floor(Math.random() * 85) + '%';

  balao.addEventListener('click', () => {
    if (!jogoBaloesAtivo) return;

    tocarSomPop();
    pontuacaoBaloes++;
    
    const placar = document.getElementById('placar-baloes');
    if (placar) placar.innerHTML = `Balloons: ${pontuacaoBaloes} / 20 | Timer: <span id="tempo-baloes">${tempoRestanteBaloes}</span>s`;
    
    balao.remove();

    if (pontuacaoBaloes >= 20 && jogoBaloesAtivo) {
      jogoBaloesAtivo = false;
      clearInterval(intervalBaloes);
      clearInterval(timerBaloes);
      setTimeout(() => {
        dispararTelaVitoria('NICEEEEE');
      }, 100);
    }
  });

  area.appendChild(balao);

  setTimeout(() => {
    if (balao.parentNode) balao.remove();
  }, 1200);
}

// --- JOGO 4: COBRINHA DO AMOR (SNAKE CLÁSSICA) ---
let cobrinha = [];
let direcaoCobrinha = 'DIREITA';
let proximaDirecao = 'DIREITA';
let comidaCobrinha = { x: 0, y: 0 };
let pontuacaoCobrinha = 0;
const OBJETIVO_COBRINHA = 150;
let loopCobrinha;
let jogoCobrinhaAtivo = false;
const TAMANHO_GRADE = 15;
const TAMANHO_BLOCO = 20;

const imgCoracaoBom = new Image();
imgCoracaoBom.src = 'coracaobom.png';

function iniciarJogoCobrinha() {
  const canvas = document.getElementById('canvas-cobrinha');
  if (!canvas) return;

  pontuacaoCobrinha = 0;
  direcaoCobrinha = 'DIREITA';
  proximaDirecao = 'DIREITA';
  jogoCobrinhaAtivo = true;

  const placar = document.getElementById('placar-cobrinha');
  if (placar) placar.innerText = `Score: ${pontuacaoCobrinha} / ${OBJETIVO_COBRINHA}`;

  cobrinha = [
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 }
  ];

  gerarComidaCobrinha();

  if (loopCobrinha) clearInterval(loopCobrinha);
  loopCobrinha = setInterval(atualizarCobrinha, 120);
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') {
    if (direcaoCobrinha !== 'BAIXO') proximaDirecao = 'CIMA';
  } else if (key === 'arrowdown' || key === 's') {
    if (direcaoCobrinha !== 'CIMA') proximaDirecao = 'BAIXO';
  } else if (key === 'arrowleft' || key === 'a') {
    if (direcaoCobrinha !== 'DIREITA') proximaDirecao = 'ESQUERDA';
  } else if (key === 'arrowright' || key === 'd') {
    if (direcaoCobrinha !== 'ESQUERDA') proximaDirecao = 'DIREITA';
  }
});

function gerarComidaCobrinha() {
  let posicaoValida = false;
  while (!posicaoValida) {
    comidaCobrinha.x = Math.floor(Math.random() * TAMANHO_GRADE);
    comidaCobrinha.y = Math.floor(Math.random() * TAMANHO_GRADE);
    
    posicaoValida = !cobrinha.some(segmento => segmento.x === comidaCobrinha.x && segmento.y === comidaCobrinha.y);
  }
}

function atualizarCobrinha() {
  const canvas = document.getElementById('canvas-cobrinha');
  if (!canvas || !jogoCobrinhaAtivo) return;
  const ctx = canvas.getContext('2d');

  direcaoCobrinha = proximaDirecao;

  let cabecaX = cobrinha[0].x;
  let cabecaY = cobrinha[0].y;

  if (direcaoCobrinha === 'CIMA') cabecaY--;
  else if (direcaoCobrinha === 'BAIXO') cabecaY++;
  else if (direcaoCobrinha === 'ESQUERDA') cabecaX--;
  else if (direcaoCobrinha === 'DIREITA') cabecaX++;

  if (cabecaX < 0 || cabecaX >= TAMANHO_GRADE || cabecaY < 0 || cabecaY >= TAMANHO_GRADE) {
    dispararTelaDerrotaCobrinha();
    return;
  }

  for (let i = 0; i < cobrinha.length; i++) {
    if (cobrinha[i].x === cabecaX && cobrinha[i].y === cabecaY) {
      dispararTelaDerrotaCobrinha();
      return;
    }
  }

  const novaCabeca = { x: cabecaX, y: cabecaY };

  if (cabecaX === comidaCobrinha.x && cabecaY === comidaCobrinha.y) {
    pontuacaoCobrinha += 10;
    tocarSomColetar();

    const placar = document.getElementById('placar-cobrinha');
    if (placar) placar.innerText = `Score: ${pontuacaoCobrinha} / ${OBJETIVO_COBRINHA}`;

    if (pontuacaoCobrinha >= OBJETIVO_COBRINHA) {
      dispararTelaVitoria('CONGRATS! That was good play');
      return;
    }

    gerarComidaCobrinha();
  } else {
    cobrinha.pop();
  }

  cobrinha.unshift(novaCabeca);

  ctx.fillStyle = '#faecdb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (imgCoracaoBom.complete) {
    ctx.drawImage(imgCoracaoBom, comidaCobrinha.x * TAMANHO_BLOCO, comidaCobrinha.y * TAMANHO_BLOCO, TAMANHO_BLOCO, TAMANHO_BLOCO);
  } else {
    ctx.fillStyle = '#692e79';
    ctx.fillRect(comidaCobrinha.x * TAMANHO_BLOCO, comidaCobrinha.y * TAMANHO_BLOCO, TAMANHO_BLOCO, TAMANHO_BLOCO);
  }

  cobrinha.forEach((segmento, idx) => {
    ctx.fillStyle = idx === 0 ? '#456a2d' : '#65b752';
    ctx.fillRect(segmento.x * TAMANHO_BLOCO + 1, segmento.y * TAMANHO_BLOCO + 1, TAMANHO_BLOCO - 2, TAMANHO_BLOCO - 2);
  });
}