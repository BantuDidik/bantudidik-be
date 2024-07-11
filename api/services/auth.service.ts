import { Request, Response } from "express"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from '../../config/db';

const auth = getAuth();

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

export { signup } 