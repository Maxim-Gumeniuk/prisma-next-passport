"use server";
import { cookies } from "next/headers";
import axios from "axios";

export default async function Page() {
    const accessToken = cookies().get("")?.value;

    const res = axios({
        method: "get",
        url: "/user",
        headers: {
            Authorization: accessToken,
        },
    });

    return <div>hi!!!</div>;
}
