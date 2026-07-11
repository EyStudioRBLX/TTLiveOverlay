import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOverlayElement {
  id: string;
  type: "text" | "image" | "rectangle" | "ellipse" | "line" | "triangle" | "star" | "progressbar";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  src?: string;
  objectFit?: string;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  progressValue?: number;
  progressMax?: number;
  trackColor?: string;
  progressLabel?: string;
  progressLabelSize?: number;
  progressLabelColor?: string;
  progressLabelFont?: string;
  progressStepVisible?: boolean;
  progressStepPosition?: string;
  progressStepFormat?: string;
  progressStepColor?: string;
  progressStepSize?: number;
  progressAnimationType?: string;
  progressAnimationDuration?: number;
}

export interface IOverlay extends Document {
  discordId: string;
  name: string;
  elements: IOverlayElement[];
  createdAt: Date;
  updatedAt: Date;
}

const OverlayElementSchema = new Schema<IOverlayElement>(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "rectangle", "ellipse", "line", "triangle", "star", "progressbar"], required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    content: String,
    fontSize: Number,
    color: String,
    fontWeight: String,
    fontFamily: String,
    textAlign: String,
    src: String,
    objectFit: String,
    fillColor: String,
    borderColor: String,
    borderWidth: Number,
    borderRadius: Number,
    opacity: Number,
    progressValue: Number,
    progressMax: Number,
    trackColor: String,
    progressLabel: String,
    progressLabelSize: Number,
    progressLabelColor: String,
    progressLabelFont: String,
    progressStepVisible: Boolean,
    progressStepPosition: String,
    progressStepFormat: String,
    progressStepColor: String,
    progressStepSize: Number,
    progressAnimationType: String,
    progressAnimationDuration: Number,
  },
  { _id: false }
);

const OverlaySchema = new Schema<IOverlay>(
  {
    discordId: { type: String, required: true },
    name: { type: String, required: true, default: "Neues Overlay" },
    elements: { type: [OverlayElementSchema], default: [] },
  },
  { timestamps: true }
);

const Overlay: Model<IOverlay> =
  mongoose.models.Overlay || mongoose.model<IOverlay>("Overlay", OverlaySchema);

export default Overlay;
