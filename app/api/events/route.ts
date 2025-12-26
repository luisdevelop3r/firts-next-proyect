import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest){
    try {
        await connectDB();

        const formData = await req.formData();

        const file = formData.get('image') as File;

        if(!file) {
            return NextResponse.json({ message: 'Image is required' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);
                resolve(results);
        }).end(buffer);
    })

        // Build event object from form data
        const eventData = Object.fromEntries(formData.entries()) as Record<string, any>;
        
        // Assign the uploaded image URL
        eventData.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create(eventData);

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to create event', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 });
    }
}

export async function GET(){
    try{
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Failed to get events', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 });
    }
}