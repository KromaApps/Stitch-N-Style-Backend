import designerModel from "../models/designerModel.js";
import productModel from "../models/productModel.js";

export const searchEntities = async (req, res) => {
  try {
    const { query } = req.body;

    const designers = await designerModel.find({
      name: { $regex: query, $options: "i" },
    });

    const products = await productModel.find({
      name: { $regex: query, $options: "i" },
    });

    res.json({ success: true, designers, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const { query } = req.body;
    const designers = await designerModel
      .find({
        name: { $regex: query, $options: "i" },
      })
      .limit(5); // 5 designers

    const products = await productModel
      .find({
        name: { $regex: query, $options: "i" },
      })
      .limit(5); // 5 products

    res.json({ success: true, designers, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
