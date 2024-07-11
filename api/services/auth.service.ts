import { Request, Response } from "express"
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../../config/db';

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
            const idToken = userCredential._tokenResponse.idToken
            const isVerified = userCredential.user.emailVerified

            if (!isVerified) {
                res.status(403).json({ message: "Please verify your email address" });
                return;
            }

            if (idToken) {
                res.cookie('access_token', idToken, {
                    httpOnly: true
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