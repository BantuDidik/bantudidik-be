import { Request, Response } from "express"
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { Personal } from "../interfaces/personal.interface"
import { db } from "../../config/db"

const get = async (req : Request, res: Response) => {
    const idUser = req.params.idUser;

    try {
        const personalRef = doc(db, "personals", idUser);
        const personalSnapshot = await getDoc(personalRef);
        
        if (personalSnapshot.exists()) {
            const data = personalSnapshot.data()
            const result : Personal = 
            {
                id: personalSnapshot.id,
                name: data.name,
                phoneNumber: data!.phoneNumber,
                birthDate: new Date(data.birthDate.seconds*1000),
                occupation: data.occupation,
                location: data.location,
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
        const { idUser, name, phoneNumber, birthDate, occupation, location} = req.body;

        await setDoc(doc(db, "personals", idUser), {
            name,
            phoneNumber,
            occupation,
            location,
            birthDate: new Date(birthDate),
            createdAt: Timestamp.now(),
        });

        res.status(200).json({ message: "Personal info added successfully" });
    } catch (error : any) {
        res.status(500).json({ message: "Error creating personal info", error: error.message });
    }
}

export { get, create } 