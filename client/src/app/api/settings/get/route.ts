import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {ownerId} = await req.json();
        if(!ownerId){
            return NextResponse.json(
                {message:"owner id  are required"}, 
                {status:400}
            )
        }

        await connectDb();
        const settings = await Settings.findOne(
            {ownerId}
        ) 
        return NextResponse.json(
            {message:"Settings saved successfully", settings }, 
            {status:200}
        
        )
    } catch (error) {
         return NextResponse.json(
            {message:`get settings error ${error}`}, 
            {status:500}
        )
    }
}