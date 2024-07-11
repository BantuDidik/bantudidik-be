import { Request, Response, NextFunction } from "express";
import { admin } from "../../config/db";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

interface RequestIncludesUser extends Request{
    user: DecodedIdToken
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.cookies.access_token;

    if (!idToken) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as RequestIncludesUser).user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ error: 'Unauthorized' });
    }
};

export { verifyToken };
