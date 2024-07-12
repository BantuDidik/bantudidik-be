import { Application, Request, Response } from "express"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pdfToText } from 'pdf-ts';
import axios from 'axios'
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/db";

const execute = async (req : Request, res: Response) => {
    try {
        const idFunding = req.params.idFunding;

        // Fetching Funding Attributes
        let fundingTitle;
        let fundingDescription

        const fundingRef = doc(db, "fundings", idFunding);
        const fundingSnapshot = await getDoc(fundingRef);
        
        if (fundingSnapshot.exists()) {
            const data = fundingSnapshot.data()
            fundingTitle = data.title
            fundingDescription = data.description
        }

        // Fetching Applications
        const applicationRef = collection(db, 'applications');
        let q = query(applicationRef, where("offerId", "==", idFunding));
        const applicationSnapshot = await getDocs(q);

        let applications : any [] = []

        applicationSnapshot.docs.forEach((data) => {
            const docData = data.data();

            applications.push({
                id: data.id,
                description: docData.description,
                requirements: docData.requirements
            });
        });

        const processedApplications = await Promise.all(applications.map(async (applicant) => {
            const id = applicant.id;
            const description = applicant.description;
            let cv = null;
            let motivationLetter = null;

            if (applicant.requirements.cv !== null) {
                const cvFile = await axios.get(applicant.requirements.cv, {
                    responseType: 'arraybuffer'
                });

                const pdf = cvFile.data;
                cv = await pdfToText(pdf);
            }

            if (applicant.requirements.motivationLetter !== null) {
                const motletFile = await axios.get(applicant.requirements.motivationLetter, {
                    responseType: 'arraybuffer'
                });

                const pdf = motletFile.data;
                motivationLetter = await pdfToText(pdf);
            }

            return {
                id,
                description,
                motivationLetter,
                cv
            };
        }));
        
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const prompt = `
            Kamu adalah seorang Human Resource yang berpengalaman dalam screening dokumen kandidat seperti CV, motivation letter, dan lain-lain.
            Terdapat open funding yang diadakan oleh orang yang sedang ingin berbagi, dan orang lain bisa apply ke open funding-nya.
            Kamu ditugaskan untuk mennyeleksi CV dan motivation letter dari semua applicants yang mendaftar dan cari satu yang cocok dengan deskripsi open fundingnya.
            Berikan output dengan format json berikut:

            {
                idApplication: 'idApplication-yang-lolos',
                alasan: 'alasan-kenapa-dia-terpilih'
            }

            Judul funding : ${fundingTitle}
            Deskripsi funding : ${fundingDescription}

            Applicants:
            ${JSON.stringify(processedApplications)}
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