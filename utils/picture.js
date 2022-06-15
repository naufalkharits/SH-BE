const Picture = require("../models").Picture;
const fs = require("fs/promises");
const path = require("path");

module.exports = {
  validatePictures: (pictures) => {
    let acceptedMimetypes = ["image/png", "image/jpg", "image/jpeg"];

    for (const picture of pictures) {
      if (acceptedMimetypes.indexOf(picture.mimetype) < 0) {
        throw new Error("Valid picture format is required");
      }

      if (picture.size > 5 * 1000 * 1000) {
        throw new Error("Picture size cannot be larger than 5 MB");
      }
    }
  },

  uploadImages: async (images, productId) => {
    try {
      const pictures = [];

      for (let idx = 0; idx < images.length; idx++) {
        const newPicture = await Picture.create({
          product_id: productId,
        });

        const imageExt = images[idx].mimetype.replace("image/", "");
        const imageName = `${newPicture.id}.${imageExt}`;

        const imagePath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          imageName
        );

        await fs.writeFile(imagePath, images[idx].buffer);
        pictures.push(imageName);
      }

      return pictures;
    } catch (error) {
      throw error;
    }
  },
};
