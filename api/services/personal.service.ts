import { Request, Response } from "express"
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/db"

const get = async (req : Request, res: Response) => {
    const idUser = req.params.idUser;

    try {
        const userRef = doc(db, "personals", idUser);
        const userSnapshot = await getDoc(userRef);
        
        if (userSnapshot.exists()) {
            const data = userSnapshot.data()
            const result = 
            {
                name: data.name,
                phoneNumber: data!.phoneNumber,
                birthDate: new Date(data.birthDate.seconds*1000),
                occupation: data.occupation,
                createdAt: new Date(data.createdAt.seconds*1000),
            }
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Personal info not found" });
        }

    } catch (error : any) {
        res.status(500).json({ message: "Error fetching personal info", error: error.message });
    }
}


const create = async (req : Request, res: Response) => {
    try {
        const { idUser, name, phoneNumber, birthDate, occupation } = req.body;

        await setDoc(doc(db, "personals", idUser), {
            name: name,
            phoneNumber: phoneNumber,
            birthDate: new Date(birthDate),
            occupation: occupation,
            createdAt: Timestamp.now(),
        });

        res.status(200).json({ message: "Personal info added successfully" });
    } catch (error : any) {
        res.status(500).json({ message: "Error creating personal info", error: error.message });
    }
}

export { get, create } 