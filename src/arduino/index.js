// Importação de dependências
import { SerialPort, ReadlineParser } from 'serialport'
import { observer } from '../utils.js'
var config = {}

// Configuração: Comunicação Serial
const port = openPort()
function openPort() {
    return new SerialPort({
        path: 'COM'+process.env.COM,
        baudRate: 9600
    }, (err) => {
        // Repetir conexão em falhas
        if (!err) return
        setTimeout(() => {
            openPort()
        }, 5000)
        return console.log('> Error (Arduino Serial Comm): ' + err, '\n> Trying again in 5 seconds')
    })
}
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

// Detectando abertura da porta
port.on('open', () => {
    console.log(`> Arduino funcionando no Baud Rate: ${process.env.BAUD_RATE}`)
})


// Recebendo informações do Arduino
parser.on('data', data => {
    if (data.includes('tempo')) { // Configuração inicial: tempo pré-definido
        config = JSON.parse(data)
        console.log('> CONFIG: ' + data)
    } else if (data.includes('ON')) { // Configuração: reprodução ativa
        config.reproducao = true
    } else if (data.includes('OFF')) { // Configuração: reprodução inativa
        config.reproducao = false
    } else { // Configuração: tempo atual
        console.log('> RECEIVE: ' + parseInt(data))
        observer.notify(parseInt(data))
    }
})

export { config }