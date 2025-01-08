// Already seeded the data in database (code is just for reference for future work)

import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";
import connectDb from "./config/mongodb.js";
import designerModel from "./models/designerModel.js";
import designModel from "./models/designModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

connectDb();

const generateFakeData = async () => {
  try {
    // Delete existing designers and designs
    await designerModel.deleteMany({});
    await designModel.deleteMany({});

    // Delete all images in Cloudinary's "designers" folder
    const cloudinaryDeleteResult = await cloudinary.api.delete_resources_by_prefix(
      "designers/"
    );
    console.log("Deleted old designer images:", cloudinaryDeleteResult);

    const categories = ["Casual", "Formal", "Party", "Sports", "Traditional"];
    const subCategories = ["Men", "Women", "Kids"];

    // Upload the profile image for designers
    const defaultProfileImage = await cloudinary.uploader.upload(
      "./uploads/profile-image.webp",
      {
        resource_type: "image",
        folder: "designers",
      }
    );
    const profileImageUrl = defaultProfileImage.secure_url;

    // Create 10 fake designers
    const designers = [];
    for (let i = 0; i < 10; i++) {
      const designer = new designerModel({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profileImage: profileImageUrl,
        isTopDesigner: false,
        bio: faker.lorem.sentence(),
        professionalBackground: faker.lorem.sentence(),
        skills: [faker.word.adjective(), faker.word.noun()],
        awards: [faker.word.noun()],
        experience: faker.lorem.sentence(),
        services: [faker.word.adjective(), faker.word.noun()],
      });
      designers.push(await designer.save());
    }

    // Create fake designs
    const trendingDesigns = [];
    const allDesigns = [];
    let imageIndex = 0;

    const cloudinaryUrls = [];
    const images = [
      "cloth1.png",
      "men-cloth1.jpeg",
      "men-cloth2.jpeg",
      "men-cloth3.jpg",
      "men-cloth4.jpg",
      "men-cloth5.jpg",
      "women-clothe2.jpg",
      "women-clothe3.jpg",
      "women-clothe4.jpg",
      "women-clothe5.jpg",
    ];

    // Upload images for designs to Cloudinary
    for (const image of images) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          `./uploads/${image}`,
          {
            resource_type: "image",
            folder: "designs",
          }
        );
        cloudinaryUrls.push(uploadResult.secure_url);
      } catch (error) {
        console.error(`Error uploading image ${image}:`, error);
      }
    }

    for (const designer of designers) {
      const designCount = faker.number.int({ min: 5, max: 10 });
      console.log(`Creating ${designCount} designs for ${designer.name}`);
      for (let j = 0; j < designCount; j++) {
        const design = new designModel({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          image: cloudinaryUrls[imageIndex],
          price: faker.commerce.price(10, 100, 2),
          category: faker.helpers.arrayElement(categories),
          subCategory: faker.helpers.arrayElement(subCategories),
          sizes: ["S", "M", "L", "XL"],
          likes: faker.number.int({ min: 0, max: 1000 }),
          isTrendingDesign: false,
          designer: designer._id,
        });

        const savedDesign = await design.save();
        allDesigns.push(savedDesign);
        if (savedDesign.likes > 500) trendingDesigns.push(savedDesign);

        imageIndex = (imageIndex + 1) % cloudinaryUrls.length; // make sure only images in uploads folder should be use
      }

      // top designers based on likes
      designer.isTopDesigner =
        allDesigns.filter(
          (d) =>
            d.designer.toString() === designer._id.toString() && d.likes > 500
        ).length > 0;
      await designer.save();
    }

    // top 3 trending designs based on likes
    trendingDesigns
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3)
      .forEach(async (design) => {
        design.isTrendingDesign = true;
        await design.save();
      });

    console.log("Fake data generated successfully!");
  } catch (error) {
    console.error("Error generating fake data:", error);
  }
};

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

generateFakeData();
