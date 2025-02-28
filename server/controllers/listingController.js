import express from "express";
import * as HouseService from "../services/listingservice.js"

export const HousesController = express.Router();

// ✅ GET all houses
HousesController.get("/all", async (req, res) => {
  try {
    const houses = await HouseService.getAllListings();
    res.status(200).json({ message: "Houses retrieved", data: houses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving houses", error: error.message });
  }
});

// ✅ GET house by ID
HousesController.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const house = await HouseService.getListingById(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.status(200).json({ message: "House retrieved", data: house });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving house by ID", error: error.message });
  }
});

// ✅ POST Create a new house
HousesController.post("/create", async (req, res) => {
  try {
    const newHouse = req.body;
    const createdHouse = await HouseService.addListing(newHouse);
    res.status(201).json({ message: "House added successfully", data: createdHouse });
  } catch (error) {
    res.status(500).json({ message: "Error creating house", error: error.message });
  }
});

// ✅ PUT Update house by ID
HousesController.put("/update/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const updatedHouse = await HouseService.updateListing(id, updateData);
    res.status(200).json({ message: "House updated successfully", data: updatedHouse });
  } catch (error) {
    res.status(500).json({ message: "Error updating house", error: error.message });
  }
});

// ✅ DELETE house by ID
HousesController.delete("/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await HouseService.deleteListing(id);
    res.status(200).json({ message: `House deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting house", error: error.message });
  }
});
