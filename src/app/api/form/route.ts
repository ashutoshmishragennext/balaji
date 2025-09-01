import { db } from "@/db";
import { FormTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Received body:", body);
        
        // Validate required fields
        if (!body.companyName || !body.personName || !body.phone) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: companyName, personName, or phone"
            }, { status: 400 });
        }

        const [form] = await db.insert(FormTable).values({
            companyName: body.companyName,
            personName: body.personName,
            phone: body.phone,
            email: body.email || null, // Handle empty strings
            make: body.make || null,
            model: body.model || null,
            technicalSupport: body.technicalSupport || [], // Ensure array
            newMachineModel: body.newMachineModel || null,
            eventName: body.eventName || null,
            remarks: body.remarks || null,
        }).returning();

        console.log("Form inserted successfully:", form);
        return NextResponse.json({ success: true, form });
        
    } catch (error) {
        console.error("Database insertion error:", error);
        return NextResponse.json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}

