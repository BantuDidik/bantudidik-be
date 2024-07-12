import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Request } from "express";

interface User {
    email: string;
    password: string;
    createdAt: Date;
}

interface RequestIncludesUser extends Request{
    user: DecodedIdToken
}

export { User, RequestIncludesUser }
