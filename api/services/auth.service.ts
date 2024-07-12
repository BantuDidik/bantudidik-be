import { Request, Response } from "express"
import { db, getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../../config/db';
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { User } from "../interfaces/user.interface";

const auth = getAuth();

const login = (req : Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            email: "Email is required",
            password: "Password is required",
        });
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential : any) => { 
            const idUser = userCredential.user.uid
            const idToken = userCredential._tokenResponse.idToken
            const isVerified = userCredential.user.emailVerified

            if (!isVerified) {
                res.status(403).json({ message: "Please verify your email address" });
                return;
            }

            if (idToken) {
                
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {

                    const newUser: User = {
                        email,
                        password,
                        createdAt: new Date(),
                    };

                    await setDoc(doc(db, "users", idUser), newUser);
                }

                res.cookie('access_token', idToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                  });
                  
                res.status(200).json({ message: "User logged in successfully", userCredential });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        })
        .catch((error) => {
            console.error(error);
            const errorMessage = error.message || "An error occurred while logging in";
            res.status(500).json({ error: errorMessage });
        });
}

const signup = (req : Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        email: "Email is required",
        password: "Password is required",
      });
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser!)
          .then( async() => {
            res.status(201).json({ message: "Verification email sent!" });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error sending email verification" });
          });
      })
      .catch((error) => {
        console.error(error);
        const errorMessage = error.message || "An error occurred while registering user";
        res.status(500).json({ error: errorMessage });
      });
}

const logout = (req: Request, res: Response) => {
    signOut(auth)
        .then(() => {
            res.clearCookie('access_token');
            res.status(200).json({ message: "User logged out successfully" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
}

export { login, signup, logout } 