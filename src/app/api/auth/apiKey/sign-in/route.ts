import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import bcrypt from "bcrypt";
import { prisma } from "@/app/clients/prisma";

export async function POST(request: Request, res: NextResponse) {
    try {
        const data = await request.json();

        const { email, password } = data;

        const foundUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            return NextResponse.json({ msg: "User not found!" });
        }
        const comparePasswords = await bcrypt.compare(
            password,
            foundUser?.password!
        );

        if (comparePasswords) {
            const apiKey = crypto.randomUUID();

            cookies().set("apiKey", apiKey);

            return NextResponse.json({ foundUser, apiKey });
        }

        return NextResponse.json({
            msg: "Password is not valid!",
        });
    } catch (e) {
        console.log(e, "error");
        NextResponse.json({
            msg: "AUTH API-KEY ERROR",
        });

        return NextResponse.redirect(new URL("/login", request.url));
    }
}
