import { NextApiRequest, NextApiResponse } from "next";
import session from 'next-session'
import { checkAuthMethod } from "./utils/checkAuthStrategy";

export async function middleware(
    request: NextApiRequest,
    response: NextApiResponse
) {
    checkAuthMethod(request, response)
}
