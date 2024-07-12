import { Request, Response } from "express"
import { db } from '../../config/db';
import { collection, getDocs, query, where } from "firebase/firestore";
import { Notification } from "../interfaces/notification.interface"

const list = async (req: Request, res: Response) => {
    try {
        const user = req.query.user;

        const notificationRef = collection(db, 'notifications');

        let q = query(notificationRef, where("idUser", "==", user));

        const fundingSnapshot = await getDocs(q);

        const result : Notification[] = fundingSnapshot.docs.map((data) => {
            const docData = data.data();
            return {
                id: data.id,
                idUser: docData.idUser,
                message: docData.message,
                link: docData.link,
                createdAt: new Date(docData.createdAt.seconds*1000),
            }
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message || error });
    }
};

export { list } 