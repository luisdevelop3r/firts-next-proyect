import mongoose, { Document, Model, Schema } from 'mongoose';
import { BaseEvent } from '@/lib/constants';

// TypeScript interface for Event document
// Extends shared BaseEvent type to avoid type drift between UI and database
export interface IEvent extends BaseEvent, Document {
  description: string;
  overview: string;
  venue: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook to generate slug, normalize date and time
 * - Generates URL-friendly slug from title (only if title changed)
 * - Normalizes date to ISO 8601 format (YYYY-MM-DD)
 * - Normalizes time to 24-hour format (HH:MM)
 */
EventSchema.pre('save', function (next) {
  // Generate slug only if title has changed
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^[-]+|[-]+$/g, ''); // Remove leading and trailing hyphens
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date')) {
    // Parse as UTC to avoid timezone shifts
    const parsedDate = new Date(this.date + 'T00:00:00Z');
    if (isNaN(parsedDate.getTime())) {
      return next(new Error('Invalid date format. Expected ISO 8601 date.'));
    }
    this.date = parsedDate.toISOString().split('T')[0];
  }

  // Normalize time to 24-hour format (HH:MM)
  if (this.isModified('time')) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(this.time)) {
      return next(
        new Error('Invalid time format. Expected HH:MM in 24-hour format.')
      );
    }
    // Parse and normalize: pad single-digit hours to two digits (e.g., '9:30' -> '09:30')
    const [hour, minute] = this.time.split(':');
    this.time = `${hour.padStart(2, '0')}:${minute}`;
  }

  next();
});


// Export Event model (use existing model if already compiled)
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
