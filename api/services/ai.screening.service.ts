import { Request, Response } from "express"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pdfToText } from 'pdf-ts';
import fs from 'fs'
import axios from 'axios'

const execute = async (req : Request, res: Response) => {
    try {
        // const response1 = await axios.get("https://files.edgestore.dev/50ianbqbdkc74mtt/publicFiles/_public/76d7778b-646f-4ee9-a1dc-b8e8bd70f630.pdf", {
        //     responseType: 'arraybuffer'
        // });

        // // Extract the PDF text
        // const pdf = response1.data;
        // const text1 = await pdfToText(pdf);

        let text;
        let pdfBuffer;
        let motlet = []
        let cv = []

        const funding = {
            title : 'Biaya SIMAK UI',
            description : 'Hi disini saya kebetulan baru saja menerima gaji pertama saya. Disini saya ingin membagikan uang untuk keperluan pendaftaran apapun bagi yang membutuhkan, syaratnya bisa dilihat sendiri. Good luck, doakan saya rezekinya lancar aamiin:*  '
        }

        try {
            pdfBuffer = await fs.promises.readFile('./motlet1.pdf');
            text = await pdfToText(pdfBuffer);
            motlet.push({
                nama: 'Anisa Putri',
                idUser: "111111",
                motlet: text
            })

            pdfBuffer = await fs.promises.readFile('./motlet2.pdf');
            text = await pdfToText(pdfBuffer);
            motlet.push({
                nama: 'Budi Santoso',
                idUser: "222222",
                motlet: text
            })

            pdfBuffer = await fs.promises.readFile('./motlet3.pdf');
            text = await pdfToText(pdfBuffer);
            motlet.push({
                nama: 'Siti Nurhaliza',
                idUser: "333333",
                motlet: text
            })
        } catch (error) {
            console.error('Error collecting motlet:', error);
        }

        try {
            pdfBuffer = await fs.promises.readFile('./CV1.pdf');
            text = await pdfToText(pdfBuffer);
            cv.push({
                nama: 'Anisa Putri',
                idUser: "111111",
                cv: text
            })

            pdfBuffer = await fs.promises.readFile('./CV2.pdf');
            text = await pdfToText(pdfBuffer);
            cv.push({
                nama: 'Budi Santoso',
                idUser: "222222",
                cv: text
            })

            pdfBuffer = await fs.promises.readFile('./CV3.pdf');
            text = await pdfToText(pdfBuffer);
            cv.push({
                nama: 'Siti Nurhaliza',
                idUser: "333333",
                cv: text
            })
        } catch (error) {
            console.error('Error collecting motlet:', error);
        }

    
        const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const prompt = `
            Kamu adalah seorang Human Resource yang berpengalaman dalam screening dokumen kandidat seperti CV, motivation letter, dan lain-lain.
            Ada open funding yang diadakan oleh orang yang sedang ingin berbagi, dan orang lain bisa apply ke open fundingnya.
            Kamu ditugaskan untuk menseleksi CV dan motivation letter dari semua applicants yang mendaftar dan seleksi satu yang cocok dengan deskripsi open fundingnya.
            Berikan output berupa json:

            {
                nama: 'nama-yang-lolos',
                idUSer: 'idUser-yang-lolos',
                alasan: 'alasan-kenapa-dia-terpilih'
            }

            berikut deskripsi funding:${JSON.stringify(funding)}

            berikut filenya:
            - motivation letter: ${JSON.stringify(motlet)}
            - cv: ${JSON.stringify(cv)}
        `
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseString = response.text().replace(/^```json\s+/, '').replace(/\s+```$/, '');;
        res.status(200).send(JSON.parse(responseString));
    } catch (error) {
        console.error("Error Gemini:", error);
        res.status(500).send("Error Gemini");
    }
}

export { execute } 