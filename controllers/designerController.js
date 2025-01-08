import designerModel from "../models/designerModel.js";
import designModel from "../models/designModel.js";
import { v2 as cloudinary } from "cloudinary";

const getDesignerDetails = async (req, res) => {
  try {
    const designerId = req.params.id;

    const designer = await designerModel.findById(designerId).exec();

    if (!designer) {
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    }

    const portfolio = await designModel
      .find({ designer: designerId })
      .limit(4)
      .exec();

    res.json({
      success: true,
      designer: {
        name: designer.name,
        bio: designer.bio,
        profileImage: designer.profileImage,
        professionalBackground: designer.professionalBackground,
        skills: designer.skills,
        awards: designer.awards,
        experience: designer.experience,
        services: designer.services,
        reviews: designer.reviews,
      },
      portfolio: portfolio.map((design) => design.image[0]), // first image as preview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const addDesigner = async (req, res) => {
//   try {
//     const { name, email, password, isTopDesigner } = req.body;
//     const image = req.files?.image && req.files.image[0];

//     let profileImageUrl = "";
//     if (image) {
//       const uploadResult = await cloudinary.uploader
//         .upload(image.path, {
//           resource_type: "image",
//           folder: "designs",
//         })
//         .catch((err) => {
//           console.error("Cloudinary upload error:", err);
//           throw new Error("Failed to upload image to Cloudinary");
//         });

//       profileImageUrl = uploadResult.secure_url;
//     }

//     const designer = new designerModel({
//       name,
//       email,
//       password,
//       isTopDesigner: isTopDesigner === "true",
//       profileImage: profileImageUrl,
//     });

//     const savedDesigner = await designer.save();
//     if (!savedDesigner) {
//       console.error("Error saving design to DB:", designer);
//     }

//     res.json({
//       success: true,
//       message: "Designer added successfully",
//       designer,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const updateDesignerProfile = async (req, res) => {
  try {
    const designerId = req.params.id;
    const {
      bio,
      professionalBackground,
      skills,
      awards,
      experience,
      services,
    } = req.body;

    const updatedDesigner = await designerModel.findByIdAndUpdate(
      designerId,
      {
        bio,
        professionalBackground,
        skills,
        awards,
        experience,
        services,
      },
      { new: true }
    );

    if (!updatedDesigner) {
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    }

    res.json({ success: true, designer: updatedDesigner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const listDesigners = async (req, res) => {
//   try {
//     const designers = await designerModel.find({});
//     res.json({ success: true, designers });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const listTopDesigners = async (req, res) => {
  try {
    const topDesigners = await designerModel.find({ isTopDesigner: true });
    res.json({ success: true, data: topDesigners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  // addDesigner,
  // listDesigners,
  listTopDesigners,
  getDesignerDetails,
  updateDesignerProfile,
};
