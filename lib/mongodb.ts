import mongoose from 'mongoose';

// Extend the global object to include mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Establishes and returns a cached Mongoose connection to MongoDB.
 *
 * Reuses an existing cached connection when available; otherwise opens a new
 * connection with Mongoose buffering disabled and caches it for future calls.
 *
 * @returns The established `mongoose.Connection`
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Get MongoDB URI from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;

  // Validate that the MongoDB URI is provided
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // If a connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise if connection fails
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;