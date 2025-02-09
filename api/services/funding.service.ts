import { Request, Response } from "express"
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, orderBy, query, where, documentId } from "firebase/firestore";
import { db } from "../../config/db"
import { Funding } from "../interfaces/funding.interface";

const get = async (req : Request, res: Response) => {

    const idFunding = req.params.idFunding;

    try {
        const fundingRef = doc(db, "fundings", idFunding);
        const fundingSnapshot = await getDoc(fundingRef);
        
        if (fundingSnapshot.exists()) {
            const data = fundingSnapshot.data()
            const result : Funding = 
            {
                id: fundingSnapshot.id,
                title: data.title,
                description: data.description,
                type: data.type,
                idUser: data.idUser,
                status: data.status,
                transferMethod: data.transferMethod,
                imageUrl: data.imageUrl,
                nominal: data.nominal,
                applicants: data.applicants,
                jenjang: data.jenjang,
                isAnonymous: data.isAnonymous,
                startDate: new Date(data.startDate.seconds*1000),
                endDate: new Date(data.endDate.seconds*1000),
                createdAt: new Date(data.createdAt.seconds*1000),
                requirements: data.requirements,
            }
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Funding not found" });
        }

    } catch (error : any) {
        res.status(500).json({ message: "Error fetching funding", error: error.message });
    }
}

const list = async (req: Request, res: Response) => {
    try {
        const user = req.query.user;
        const status = req.query.status;
        const jenis = req.query.jenis;
        const jenjang = req.query.jenjang;
        const order = req.query.order as string;

        const fundingRef = collection(db, 'fundings');

        let q = query(fundingRef);

        if (user && status) {   
            const fundingList: string[] = []
            const applicationRef = collection(db, 'applications');

            let r = query(applicationRef, where("idUser", "==", user), where("status", "==", status));

            const applicationSnapshot = await getDocs(r);

            const result = applicationSnapshot.docs.map((data) => {
                const docData = data.data();
                fundingList.push(String(docData.offerId))               
            });
            
            if (fundingList.length !== 0){
                q = query(q, where(documentId(), "in", fundingList));
            } else {
                res.status(200).json({message: "no result"});
                return;
            }
        }

        if (jenis) {
            q = query(q, where("type", "==", jenis));
        }

        if (jenjang) {
            q = query(q, where("jenjang", "==", jenjang));
        }

        if (order) {
            q = query(q, orderBy(order, 'desc')); 
        }

        const fundingSnapshot = await getDocs(q);

        const result : Funding [] = fundingSnapshot.docs.map((data) => {
            const docData = data.data();
            return {
                id: data.id,
                title: docData.title,
                description: docData.description,
                type: docData.type,
                idUser: docData.idUser,
                status: docData.status,
                transferMethod: docData.transferMethod,
                imageUrl: docData.imageUrl,
                nominal: docData.nominal,
                applicants: docData.applicants,
                jenjang: docData.jenjang,
                isAnonymous: docData.isAnonymous,
                startDate: new Date(docData.startDate.seconds * 1000),
                endDate: new Date(docData.endDate.seconds * 1000),
                createdAt: new Date(docData.createdAt.seconds * 1000),
                requirements: docData.requirements,
            };
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching funding", error: error.message || error });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const { idUser, title, description, type, status, transferMethod, imageUrl, nominal, applicants, jenjang, isAnonymous, startDate, endDate, requirements } = req.body;
                
        const fundingCollection = collection(db, "fundings")
        
        await addDoc(fundingCollection , {
            title: title,
            description: description,
            type: type,
            idUser: idUser,
            status: status,
            transferMethod: transferMethod,
            imageUrl: imageUrl,
            nominal: nominal,
            applicants: applicants,
            jenjang: jenjang,
            isAnonymous: isAnonymous,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            createdAt: Timestamp.now(),
            requirements: requirements,
        });

        res.status(200).json({ message: "Funding added successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error creating funding", error: error.message });
    }

}

const check = async (req: Request, res: Response) => {
    const { idFunding, idUser } = req.body;

    const applicationRef = collection(db, 'applications');

    let r = query(applicationRef, where("idUser", "==", idUser), where("offerId", "==", idFunding));

    const applicationSnapshot = await getDocs(r);

    const fundingList = applicationSnapshot.docs

    if (fundingList.length === 0) {
        res.status(200).json({ isApplied: false });
    } else {
        res.status(200).json({ isApplied: true });
    }
}

export { get, list, create, check } 