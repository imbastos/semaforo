// Importação de dependências
import { observer } from '../utils.js'

// Simulação do Arduino
var i = 0
var config = {}
var data = { 'tempo': { 'verde': 8, 'amarelo': 3, 'vermelho': 11 } }
setTimeout(async() => {
    config = data
    console.log('> CONFIG: ' + JSON.stringify(data))

    setInterval(async() => {
        if (i >= Object.values(data.tempo).reduce((a, b) => a + b, 0)) i = 0
        i++
        console.log('> RECEIVE: ' + i)
        observer.notify(i)
    }, 1000)
}, 1)

export { config }