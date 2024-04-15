import { prisma } from "@/app/clients/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import bcrypt from "bcrypt";

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
            const accessToken = jwt.sign(
                { email, id: foundUser?.id },
                "secret",
                { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
                { email, id: foundUser?.id },
                "secret",
                { expiresIn: "7d" }
            );

            cookies().set("accessToken", accessToken);
            cookies().set("refreshToken", refreshToken);

            return NextResponse.json({ accessToken, foundUser, refreshToken });
        }

        return NextResponse.json({
            msg: "Password is not valid!",
        });
    } catch (e) {
        console.log(e, "error");
    }
}
