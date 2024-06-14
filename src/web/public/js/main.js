// Importação de handlebars
const handlebars = document.getElementById('handlebars')
const tempoSeguro = handlebars.getAttribute('tempoSeguro')

// Declaração de Variáveis
let infoArduino, tVerde, tAmarelo, tVermelho, tempoVoz, estado = 3
let delay = {
  ativo: false,
  estado: 0
}

// Torna a página dinâmica
window.onload = (() => {
  setInterval(async () => {
    infoArduino = await (await fetch('/semaforo')).json() // Atualiza as infos do Arduino
    atualizarApp(infoArduino)
  }, 100)
})

// Atualiza todos os sistemas
function atualizarApp({ tempo: { real, verde, amarelo, vermelho }, deveTocar }) {
  // Determina o estado do semáforo com base no tempo atual (real) e tempos de cada fase
  tVerde = verde
  tAmarelo = amarelo
  tVermelho = vermelho

  if (real <= verde) { // Sinal dos carros aberto
    estado = 1
  } else if (real > verde && real <= verde + amarelo) { // Sinal dos carros fechando
    estado = 2
  } else if (real >= verde + amarelo && real < verde + vermelho - amarelo) { // Sinal dos carros fechado
    estado = 3
  } else if (real > verde + vermelho) { // Sinal dos carros abrindo
    estado = 4
  }
  if (delay.estado !== estado) delay = {
    ativo: false,
    estado: 0
  }

  if (!delay.ativo) {
    if (deveTocar) sistemaSom(estado)
    carros(estado)
    cego(estado)
  } // Ativa a animação dos carros e o cego
  sistemaLuzes(estado) // Atualiza visualmente as luzes do semáforo conforme o estado atual
  // Executa sons específicos dependendo do estado do semáforo, se permitido pelo Arduino
}

// Função para atualizar as luzes do semáforo na interface
function sistemaLuzes(estado) {
  sinal.src = `sinal/${estado}.png` // Atualiza a imagem do semáforo com base no estado
}

// (só funciona se estiver ativado)
function sistemaSom(estado) {
  const acoes = {
    1: () => tts('vermelho'), // Se o estado for 1, reproduz o som 'vermelho'
    3: () => tts('verde') // Se o estado for 3, reproduz o som 'verde'
  }
  if (acoes[estado]) acoes[estado]() // Executa a ação correspondente ao estado atual, se existir
}

// Sistema de controle de voz
function tts(id) {
  document.getElementById(id).play() // Reproduz o áudio associado ao ID fornecido
  tempoVoz = new Date() // Atualiza o tempo da última reprodução
}

// Sistema dos carros
function carros(estado) {
  delay.ativo = true
  delay.estado = estado
  console.log(estado)
  const acoes = {
    1: () => {
      carroHParado.style.visibility = 'visible'
      carroHAnimado.style.visibility = 'hidden'
      carroVAnimado.style.visibility = 'visible'
      setTimeout(() => {
        carroVAnimado.style.visibility = 'hidden'
      }, 14000)
    }, // Se o estado for 1, o carro horizontal está parado
    3: () => {
      carroHParado.style.visibility = 'hidden'
      carroHAnimado.style.visibility = 'visible'
      carroHParado.style.transition = 'none'
      carroHParado.style.left = '2000px'
      setTimeout(() => {
        carroHAnimado.style.visibility = 'hidden'
      }, 14000)
    },// Se o estado for 3, o carro horizontal está andando
    4: () => {
      carroHAnimado.style.visibility = 'hidden'
      carroHParado.style.visibility = 'visible'
      carroHParado.style.transition = '4s all'
      carroHParado.style.left = '1508px'
    } // Se o estado for 4, o carro horizontal está chegando no semáforo
  }
  if (acoes[estado]) acoes[estado]() // Executa a ação correspondente ao estado atual, se existir
}

// Sistema do cego
function cego(estado) {
  const cegoOBJ = document.getElementById('cego')
  const acoes = {
    1: () => {
      if (cegoOBJ.style.left !== '1500px' && Math.random() < 0.5) {
        cegoOBJ.style.transition = '4s all'
        cegoOBJ.style.left = '-500px'
        setTimeout(() => {
          cegoOBJ.src = 'cego/cego.png'
        }, 4000);
      }
    }, // Se o estado for 1, o cego está parado
    3: () => {
      if (cegoOBJ.style.left == '-500px') {
        cegoOBJ.src = 'cego/cego.gif'
        cegoOBJ.style.transition = '18s all'
        cegoOBJ.style.left = '1500px'
        setTimeout(() => {
          cegoOBJ.style.transition = 'none'
          cegoOBJ.style.left = '-1000px'
        }, 18000);
      }
    } // Se o estado for 3, o cego está andando
  }
  if (acoes[estado]) acoes[estado]() // Executa a ação correspondente ao estado atual, se existir
}