const express = require('express');
const cors = require('cors');
const xml2js = require('xml2js');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(
    cors({
      origin: "https://cotacao-frontend.vercel.app", // Apenas o frontend pode fazer requisições
    })
  );
app.use(express.json());

app.get('/api/historical/:moeda', async (req, res) => {
    const { moeda } = req.params;
    const dias = 30
    const API_HISTORICAL_URL = process.env.API_HISTORICAL_URL

    console.log("Moeda recebida:" + moeda)
  try {
    const response = await axios.get(`${API_HISTORICAL_URL}${moeda}/${dias}`);
    console.log('Dados recebidos:', response.data); // Depuração
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro no servidor:', error); // Depuração do erro
    console.log('Tipo de res:', typeof res); // Certifique-se de que res é um objeto
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

app.get('/api/moedas', async(req, res) => {

    const API_MOEDAS_URL = process.env.API_MOEDAS_URL

    try{
        const response = await axios.get(`${API_MOEDAS_URL}`)
        const xmlData = response.data;

        xml2js.parseString(xmlData, (err, result) => {
            if (err){
                console.error('Erro ao processar XML:', err);
                res.status(500).json({ error: "Erro ao processar dados XML" });
                return;
            }
            res.status(200).json(result)
        })
    } catch (error) {
        console.error('Erro no servidor:', error); // Depuração do erro
        console.log('Tipo de res:', typeof res); // Certifique-se de que res é um objeto
        res.status(500).json({ error: "Erro ao buscar dados" });
    }
})

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})

