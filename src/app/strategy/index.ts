import { ExtractJwt, Strategy } from "passport-jwt";

import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { prisma } from "@/app/clients/prisma";

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
};

const router = createRouter<NextApiRequest, NextApiResponse>();

export const jwtStrategy = new Strategy(opts, async (jwtPayload, done) => {
    try {
        router.use((req) =>
            jwtStrategy.authenticate(req as any, { sesion: false })
        );

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
        });

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
});

export const apiKeyStrategy = new HeaderAPIKeyStrategy(
    { header: "Authorization", prefix: "Api-Key " },
    false,
    async function (apiKey, done) {
        router.use((req) =>
            apiKeyStrategy.authenticate(req as any, { sesion: false })
        );

        const user = await prisma.user.findFirst({
            where: { apiKey },
        });

        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
);
