import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {ownerId, businessName, supportEmail, knowledge} = await req.json();
        if(!ownerId || !businessName || !supportEmail || !knowledge){
            return NextResponse.json(
                {message:"owner id  are required"}, 
                {status:400}
            )
        }

        await connectDb();
        const settings = await Settings.findOneAndUpdate(
            {ownerId},
            {businessName, supportEmail, knowledge},
            {new:true, upsert:true}
        ) 
        return NextResponse.json(
            {message:"Settings saved successfully", settings}, 
            {status:200}
        
        )
    } catch (error) {
        return NextResponse.json(
            {message:`settings error ${error}`}, 
            {status:500}
        ) 
    }
}


export async function GET(req:NextRequest) {

    try {
        
    } catch (error) {
        
    }
}