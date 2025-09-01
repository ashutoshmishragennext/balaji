import { db } from "@/db";
import { FormTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const forms = await db.select().from(FormTable);
        return NextResponse.json({ success: true, forms });
    } catch (error) {
        console.error("Database fetch error:", error);
        return NextResponse.json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}