import { prisma } from "@/app/clients/prisma";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const { email, password } = data;

        const foundUser = await prisma.user.findUnique({
            where: { email },
        });

        if (foundUser) {
            return NextResponse.json({
                msg: "User with this email already exist",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ email: newUser.email, name: newUser.name });
    } catch (e: any) {
        console.log(e, "error");
        return NextResponse.json({msg: e.message});
    }
}
