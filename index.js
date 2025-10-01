import express, { response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer'

const app = express();
const ai = new GoogleGenAI({});

app.use(cors());
// app.use(multer());
app.use(express.json())

app.post(
    '/chat',
    async (req, res) => {
        const { body } = req;
        const { prompt } = body;
        if(!prompt || typeof prompt !== 'string'){
            res.status(400).json({
                message: "Prompt harus diisi dan harus berupa string",
                data: null,
                success: false
            });
            return
        }
        try{
            const aiResponse = await ai.models.generateContent({
                model: ' gemini-2.5flash',
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });res.status(200).json({
                success: true,
                data: aiResponse.text,
                message: "Berhasil ditanggapi AI"
            });
        }
        catch(e){
            console.log(e);
            res.status(500).json({
                success:false,
                data: null,
                message: e.message || "ada masalah di server"
            });
        }
    }
);

app.listen(3000, ()=>{
    console.log("I LOVE YOU 3000")
})