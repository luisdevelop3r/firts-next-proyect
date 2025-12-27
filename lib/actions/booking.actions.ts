'use server'

import Booking from '@/database/booking.model'
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
  try{
    // Validate email format
    if (!email || !email.trim()) {
      return { success: false, error: 'Email is required' };
    }

    // Validate eventId format
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return { success: false, error: 'Invalid event ID' };
    }

    await connectDB();
    await Booking.create({ 
      eventId: new mongoose.Types.ObjectId(eventId),
      email: email.trim().toLowerCase()
    });

    return { success: true };
  } catch (e: any) {
    console.error('create booking failed', e)
    
    // Handle specific MongoDB errors
    if (e.code === 11000) {
      return { success: false, error: 'You have already booked this event' };
    }
    
    if (e.name === 'ValidationError') {
      return { success: false, error: e.message || 'Validation error' };
    }

    return { success: false, error: e.message || 'Failed to create booking' };
  }
}

