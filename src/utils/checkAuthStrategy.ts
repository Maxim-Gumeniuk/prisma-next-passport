import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import passport from "passport";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const checkAuthMethod = (req: NextApiRequest, res: NextApiResponse) => {
    const authorizationHeader = req.cookies?.Authorization;
    const strategy: "jwt" | "apikey" = authorizationHeader?.includes("Bearer")
        ? "jwt"
        : "apikey";
        
    try {
        router.use((req, res, next) => {
            passport.authenticate(strategy, { session: false })(req, res, next);

        });
    } catch (e) {
        console.log(e);
    }
};
