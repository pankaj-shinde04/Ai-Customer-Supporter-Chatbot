import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {ownerId, businessName, supportEmail, knowledge} = await req.json();
        console.log("Received settings data:", { ownerId, businessName, supportEmail, knowledge });
        
        if(!ownerId || !businessName || !supportEmail || !knowledge){
            return NextResponse.json(
                {message:"owner id  are required"}, 
                {status:400}
            )
        }

        console.log("Connecting to database...");
        await connectDb();
        console.log("Database connected, saving settings...");
        
        const settings = await Settings.findOneAndUpdate(
            {ownerId},
            {businessName, supportEmail, knowledge},
            {new:true, upsert:true}
        ) 
        console.log("Settings saved:", settings);
        
        return NextResponse.json(
            {message:"Settings saved successfully", settings}, 
            {status:200}
        
        )
    } catch (error: any) {
        console.error("Settings error:", error);
        return NextResponse.json(
            {message:`settings error: ${error.message}`}, 
            {status:500}
        ) 
    }
}


export async function GET(req:NextRequest) {

    try {
        
    } catch (error) {
        
    }
}