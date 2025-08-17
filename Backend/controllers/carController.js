// controllers/carController.js
import Product from "../models/Product.js";

// ✅ Create a new car
export const createCar = async (req, res) => {
  try {
    const carData = { ...req.body, sellerId: req.user.id }; // Attach seller
    const newCar = await Product.create(carData);
    res.json({ success: 1, car: newCar });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get car details by ID
export const getCarDetails = async (req, res) => {
  try {
    const car = await Product.findById(req.params.id).populate("sellerId", "username email");
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update car (only seller can update)
export const updateCar = async (req, res) => {
  try {
    const car = await Product.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own car" });
    }

    Object.assign(car, req.body); // Update fields
    await car.save();
    res.json({ success: 1, car });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete car (only seller can delete)
export const deleteCar = async (req, res) => {
  try {
    const car = await Product.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own car" });
    };

    await car.deleteOne();
    res.json({ success: 1, message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
