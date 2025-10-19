import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  userId: string;
  type:
    | "balance_below_amount"
    | "over_set_amount"
    | "all"
    | "transaction_alert"
    | "transaction_summary"
    | "balance_update";
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "balance_below_amount",
        "over_set_amount",
        "all",
        "transaction_alert",
        "transaction_summary",
        "balance_update",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
