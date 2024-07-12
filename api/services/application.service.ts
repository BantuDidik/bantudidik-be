import { Request, Response } from "express"
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/db"
import { describe } from "node:test";

const get = async (req : Request, res: Response) => {

    const idApplication = req.params.idApplication;

    try {
        const applicationRef = doc(db, "applications", idApplication);
        const applicationSnapshot = await getDoc(applicationRef);
        
        if (applicationSnapshot.exists()) {
            const data = applicationSnapshot.data()
            const result = 
            {
                id : applicationSnapshot.id,
                offerId: data.offerId,
                idUser: data.idUser,
                description: data.description,
                status: data.status,
                createdAt: new Date(data.createdAt.seconds*1000),
                requirements: data.requirements
            }
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Application not found" });
        }

    } catch (error : any) {
        res.status(500).json({ message: "Error fetching funding", error: error.message });
    }
}

const list = async (req: Request, res: Response) => {
    try {
        const user = Number(req.query.user);
        const funding = Number(req.query.funding);

        const fundingRef = collection(db, 'applications');

        let q = query(fundingRef);

        if (user) {
            q = query(q, where("idUser", "==", user));
        }

        if (funding) { 
            q = query(q, where("offerId", "==", funding));
        }

        const fundingSnapshot = await getDocs(q);

        const result = fundingSnapshot.docs.map((data) => {
            const docData = data.data();
            return {
                id: data.id,
                offerId: docData.offerId,
                idUser: docData.idUser,
                description: docData.description,
                status: docData.status,
                createdAt: new Date(docData.createdAt.seconds*1000),
                requirements: docData.requirements
            }
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching application", error: error.message || error });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const { offerId, idUser, description, status, requirements } = req.body;

        const fundingCollection = collection(db, "applications")
        
        await addDoc(fundingCollection , {
            offerId: offerId,
            idUser: idUser,
            description: description,
            status: status,
            createdAt: Timestamp.now(),
            requirements: requirements,
        });

        res.status(200).json({ message: "Application added successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error creating application", error: error.message });
    }

    // increase funding applicants count
}

const accept = async (req: Request, res: Response) => {
    try {
        const { idApplication } = req.body
        const docRef = doc(db, 'applications', idApplication);

        const applicationSnapshot = await getDoc(docRef);

        await updateDoc(docRef, {
            status : "Accepted"
        });

        let idUser;
        
        if (applicationSnapshot.exists()) {
            const data = applicationSnapshot.data()
            idUser = data.idUser
        }

        const notificationCollection = collection(db, "notifications")
        
        await addDoc(notificationCollection , {
            idUser : idUser,
            message : "kamu berhasil mendapatkan funding!"
        });

        res.status(200).json({ message: "Application accepted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error accepting application", error: error.message });
    }
}

export { get, list, create, accept } 