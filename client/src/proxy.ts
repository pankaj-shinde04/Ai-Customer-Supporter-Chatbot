import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSessions";

export async function proxy(req:NextRequest) {
   const session = await getSession();
   if(!session) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
   }
   return NextResponse.next();
}


export const config = {
    matcher: '/dashboard/:path*',
}