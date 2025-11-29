import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string): boolean {
          // RFC 5322 compliant email regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Throws an error if the event does not exist in the database
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it has been modified or is new
  if (this.isModified('eventId') || this.isNew) {
    try {
      const eventExists = await Event.exists({ _id: this.eventId });

      if (!eventExists) {
        return next(
          new Error(
            `Event with ID ${this.eventId} does not exist. Cannot create booking.`
          )
        );
      }
    } catch (error) {
      return next(
        new Error(
          `Failed to validate event: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
    }
  }

  next();
});

// Create index on eventId for faster queries and lookups
BookingSchema.index({ eventId: 1 });

// Compound index for finding bookings by event and email
BookingSchema.index({ eventId: 1, email: 1 });

// Export Booking model (use existing model if already compiled)
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
