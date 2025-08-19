// utils/nextCarId.js
import Counter from "../models/Counter.js";
export async function nextCarId() {
  const c = await Counter.findOneAndUpdate(
    { key: "carId" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return String(c.seq);
}