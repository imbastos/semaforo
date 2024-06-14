// Importação de dependências
import './web/index.js'
import { config } from './arduino/index.js'
// import { config } from './fake-arduino/index.js' // ! DEV ONLY
import { observer } from './utils.js'

// Atualizando o tempo com observer
var tempoArduino;
observer.subscribe((data) => {
  tempoArduino = data;
  return data;
})

export { tempoArduino, config }