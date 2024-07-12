import { Request, Response } from "express"
import { db, getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../../config/db';
import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";

const create = async (req : Request, res: Response) => {
    try {
        const { idSender, idReceiver, message } = req.body;

        const fundingCollection = collection(db, "appreciations")
        
        await addDoc(fundingCollection , {
            idSender: idSender,
            idReceiver: idReceiver,
            message: message,
            createdAt: Timestamp.now(),
         });

        res.status(200).json({ message: "Appreciation added successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error creating appreciation", error: error.message });
    }
}

const list = async (req : Request, res: Response) => {
    try {
        const user = req.query.user;

        const notificationRef = collection(db, 'appreciations');

        let q = query(notificationRef, where("idReceiver", "==", user));

        const fundingSnapshot = await getDocs(q);

        const result = fundingSnapshot.docs.map((data) => {
            const docData = data.data();
            return {
                id: data.id,
                idSender: docData.idSender,
                idReceiver: docData.idReceiver,
                message: docData.message,
                createdAt: new Date(docData.createdAt.seconds*1000),
            }
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching appreciations", error: error.message || error });
    }
}

export { create, list } 