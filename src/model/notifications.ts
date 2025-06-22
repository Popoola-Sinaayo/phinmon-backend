import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  userId: string;
    type: 'balance_below_amount' | 'over_set_amount' | 'all';
    title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ["balance_below_amount", "over_set_amount", "all"],
      required: true,
        },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
