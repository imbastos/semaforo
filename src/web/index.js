// Importação de dependências
import express from 'express'
import { engine } from 'express-handlebars'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { tempoArduino, config } from '../index.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuração: Express
const app = express()
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, 'public')))

// Rota padrão
app.get('/', (req, res) => {
    console.log(JSON.stringify(config))
    res.render('home', { tempoSeguro: config.tempo.verde + config.tempo.amarelo })
})

// Rota para FETCH
app.get('/semaforo', (req, res) => {
    res.json({
        tempo: {
            real: tempoArduino, verde: config.tempo.verde,
            amarelo: config.tempo.amarelo,
            vermelho: config.tempo.vermelho
        },
        deveTocar: config.reproducao
    })
})

// Ligando servidor na porta especificada
app.listen(process.env.PORT, () => {
    console.log(`> Express: localhost:${process.env.PORT}`)
})