import mongoose, { Document, Schema } from 'mongoose';

export interface IErrorLog extends Document {
  message: string;
  stack?: string;
  route?: string;
  method?: string;
  userId?: string;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

const errorLogSchema = new Schema<IErrorLog>(
  {
    message: {
      type: String,
      required: true
    },
    stack: {
      type: String
    },
    route: {
      type: String
    },
    method: {
      type: String
    },
    userId: {
      type: String
    },
    statusCode: {
      type: Number,
      required: true,
      default: 500
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    userAgent: {
      type: String
    },
    ip: {
      type: String
    }
  },
  {
    timestamps: false
  }
);

// Index for efficient querying
errorLogSchema.index({ timestamp: -1 });
errorLogSchema.index({ userId: 1, timestamp: -1 });

export const ErrorLog = mongoose.model<IErrorLog>('ErrorLog', errorLogSchema);

