const Picture = require("../models").Picture;
const Product = require("../models").Product;
const fs = require("fs/promises");
const path = require("path");
const syncFs = require("fs");
const { v4 } = require("uuid");

const imagesPath = path.join(__dirname, "..", "public", "images");

const validatePictures = (pictures) => {
  let acceptedMimetypes = ["image/png", "image/jpg", "image/jpeg"];

  for (const picture of pictures) {
    if (acceptedMimetypes.indexOf(picture.mimetype) < 0) {
      throw new Error("Valid picture format is required");
    }

    if (picture.size > 5 * 1000 * 1000) {
      throw new Error("Picture size cannot be larger than 5 MB");
    }
  }
};

const uploadImages = async (images, productId) => {
  if (!images || images.length < 1) return;

  try {
    // Upload updated pictures
    for (const image of images) {
      const newPictureName = v4();

      const imageExt = image.mimetype.replace("image/", "");
      const imageName = `${newPictureName}.${imageExt}`;

      // Add picture to DB
      await Picture.create({
        product_id: productId,
        name: imageName,
      });

      // Upload picture
      await fs.writeFile(path.join(imagesPath, imageName), image.buffer);
    }
  } catch (error) {
    throw error;
  }
};

const updateImages = async (images, productId) => {
  if (!images || images.length < 1) return;

  try {
    // Get existing pictures
    const pictures = await Picture.findAll({
      where: {
        product_id: productId,
      },
    });

    // Remove existing pictures
    for (const picture of pictures) {
      await fs.unlink(path.join(imagesPath, picture.name));
    }
    // Remove picture from DB
    await Picture.destroy({ where: { product_id: productId } });

    await uploadImages(images, productId);
  } catch (error) {
    throw error;
  }
};

const deleteAllPictures = () => {
  const folderPath = path.join(__dirname, "..", "public", "images");

  if (!syncFs.existsSync(folderPath)) {
    return;
  }

  syncFs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      syncFs.unlinkSync(path.join(folderPath, file));
    }
  });
};

module.exports = {
  validatePictures,
  uploadImages,
  updateImages,
  deleteAllPictures,
};
