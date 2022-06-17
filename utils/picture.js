const Picture = require("../models").Picture;
const path = require("path");
const syncFs = require("fs");
const { v4 } = require("uuid");
const admin = require("firebase-admin");

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

const uploadProductImages = async (images, productId) => {
  if (!images || images.length < 1) return;

  try {
    // Upload updated pictures
    for (const image of images) {
      const newPictureName = v4();

      const imageExt = image.mimetype.replace("image/", "");
      const imageName = `${newPictureName}.${imageExt}`;
      const imagePath = `images/${imageName}`;

      // Upload picture
      // await fs.writeFile(path.join(imagesPath, imageName), image.buffer);
      await admin.storage().bucket().file(imagePath).save(image.buffer);

      await admin.storage().bucket().file(imagePath).makePublic();

      const publicUrl = admin.storage().bucket().file(imagePath).publicUrl();

      // Add picture to DB
      await Picture.create({
        product_id: productId,
        name: imageName,
        url: publicUrl,
      });
    }
  } catch (error) {
    throw error;
  }
};

const updateProductImages = async (images, productId) => {
  if (!images || images.length < 1) return;

  try {
    await deleteProductImages(productId);

    await uploadProductImages(images, productId);
  } catch (error) {
    throw error;
  }
};

const deleteProductImages = async (productId) => {
  try {
    // Get existing pictures
    const pictures = await Picture.findAll({
      where: {
        product_id: productId,
      },
    });

    // Remove existing pictures
    for (const picture of pictures) {
      const imagePath = `images/${picture.name}`;
      // if (!syncFs.existsSync(path.join(imagesPath, picture.name))) return;
      // await fs.unlink(path.join(imagesPath, picture.name));
      await admin
        .storage()
        .bucket()
        .file(imagePath)
        .delete({ ignoreNotFound: true });
    }
    // Remove picture from DB
    await Picture.destroy({ where: { product_id: productId } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePictures,
  uploadProductImages,
  updateProductImages,
  deleteProductImages,
};
