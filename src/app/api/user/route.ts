import { prisma } from "@/app/clients/prisma";
import { checkAuthMethod } from "@/utils/checkAuthStrategy";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        checkAuthMethod(req, res);
        const allUser = await prisma.user.findMany();
        return NextResponse.json({
            allUser,
        });
    } catch (error) {
        return NextResponse.json(
            {
                msg: "not Auth!",
            },
            {
                status: 401,
            }
        );
    }
}
