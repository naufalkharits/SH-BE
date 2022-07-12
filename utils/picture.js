const Picture = require("../models").Picture;
const UserBiodata = require("../models").UserBiodata;
const { v4 } = require("uuid");
const admin = require("firebase-admin");

const validatePicture = (picture) => {
  let acceptedMimetypes = ["image/png", "image/jpg", "image/jpeg"];

  if (acceptedMimetypes.indexOf(picture.mimetype) < 0) {
    throw new Error("Valid picture format is required");
  }

  if (picture.size > 5 * 1000 * 1000) {
    throw new Error("Picture size cannot be larger than 5 MB");
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

const uploadProfileImage = async (image, userId) => {
  if (!image) return;

  try {
    // Remove existing profile picture
    await deleteProfileImage(userId);

    const newPictureName = v4();

    const imageExt = image.mimetype.replace("image/", "");
    const imageName = `${newPictureName}.${imageExt}`;
    const imagePath = `profiles/${imageName}`;

    // Upload picture
    await admin.storage().bucket().file(imagePath).save(image.buffer);

    await admin.storage().bucket().file(imagePath).makePublic();

    const publicUrl = admin.storage().bucket().file(imagePath).publicUrl();

    // Add picture to DB
    await UserBiodata.update(
      {
        picture: publicUrl,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const deleteProfileImage = async (userId) => {
  try {
    const userBio = await UserBiodata.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!userBio || !userBio.picture) return;

    const pictureName = userBio.picture
      .replace(
        "https://storage.googleapis.com/final-project-binar-d4a7b.appspot.com/profiles%2F",
        ""
      )
      .trim();

    const imagePath = `profiles/${pictureName}`;

    await admin
      .storage()
      .bucket()
      .file(imagePath)
      .delete({ ignoreNotFound: true });

    await UserBiodata.update(
      {
        picture: null,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePicture,
  uploadProductImages,
  updateProductImages,
  deleteProductImages,
  uploadProfileImage,
};
