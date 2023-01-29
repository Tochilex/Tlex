import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//To be able to use the dotenv variables
dotenv.config();


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//To initialize express
const app = express();

//To make cors request
app.use(cors());

//Allow us pass json from frontend to backend
app.use(express.json());

// Dummy root route. with get route, can't recieve a lot of data compared to post 
app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello from Tlex",
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        
        //Response from openai
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        //After getting data from openai, send back to frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))