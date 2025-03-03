require("dotenv").config()
const Picture = require("../models").Picture
const UserBiodata = require("../models").UserBiodata
const { v4 } = require("uuid")
const { decode } = require("base64-arraybuffer")
// const admin = require("firebase-admin");
const { createClient } = require("@supabase/supabase-js")
const sdk = require("node-appwrite")
const { InputFile } = require("node-appwrite/file")
const { PassThrough } = require("stream")

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const appwriteClient = new sdk.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("secondhand")
  .setKey(process.env.APPWRITE_API_KEY)
const appwriteStorage = new sdk.Storage(appwriteClient)
console.log(appwriteStorage)

const validatePicture = (picture) => {
  let acceptedMimetypes = ["image/png", "image/jpg", "image/jpeg"]

  if (acceptedMimetypes.indexOf(picture.mimetype) < 0) {
    throw new Error("Valid picture format is required")
  }

  if (picture.size > 5 * 1000 * 1000) {
    throw new Error("Picture size cannot be larger than 5 MB")
  }
}

const uploadProductImages = async (images, productId) => {
  if (!images || images.length < 1) return
  console.log(images)

  try {
    // Upload updated pictures
    for (const image of images) {
      console.log(image)
      const newPictureName = v4()
      const imageExt = image.mimetype.replace("image/", "")
      const imageName = `${newPictureName}.${imageExt}`
      const imagePath = `images/${imageName}`

      const stream = new PassThrough()
      stream.end(image.buffer)

      // If running in Node.js, use InputFile
      const appwriteUpload = await appwriteStorage.createFile("secondhand", ID.unique(), stream)
      console.log(appwriteUpload)

      // const fileBase64 = decode(image.buffer.toString("base64"));
      // console.log(fileBase64)
      // console.log('Image Buffer:', image.buffer);
      // const fileBlob = new Blob([image.buffer], { type: image.mimetype });
      // console.log(fileBlob)

      // Upload picture
      // await admin.storage().bucket().file(imagePath).save(image.buffer);

      // await admin.storage().bucket().file(imagePath).makePublic();

      // const publicUrl = admin.storage().bucket().file(imagePath).publicUrl();

      // const { data, error } = await supabase.storage.from('secondhand').upload(imagePath, blob);
      // console.log(data)
      // console.log(error)

      //   const { data, error } = await supabase.storage.from('secondhand').upload(image.originalname, fileBase64, {contentType: image.mimetype,})
      //     if (error) {
      //       throw error;
      //     }

      //     const { data: gambar } = supabase.storage
      //   .from("images")
      //   .getPublicUrl(data.path);

      // console.log({ image: image.publicUrl });

      // console.log(data)

      // const { publicURL } = supabase.storage
      //   .from('images')
      //   .getPublicUrl(filePath)

      // console.log(publicURL)

      // Add picture to DB
      // await Picture.create({
      //   product_id: productId,
      //   name: imageName,
      //   url: publicURL,
      // });
    }
  } catch (error) {
    throw error
  }
}

const updateProductImages = async (images, productId) => {
  if (!images || images.length < 1) return

  try {
    await deleteProductImages(productId)

    await uploadProductImages(images, productId)
  } catch (error) {
    throw error
  }
}

const deleteProductImages = async (productId) => {
  try {
    // Get existing pictures
    const pictures = await Picture.findAll({
      where: {
        product_id: productId,
      },
    })

    // Remove existing pictures
    for (const picture of pictures) {
      const imagePath = `images/${picture.name}`

      // await admin
      //   .storage()
      //   .bucket()
      //   .file(imagePath)
      //   .delete({ ignoreNotFound: true });

      await supabase.storage.from("bucket").remove(imagePath)
    }

    // Remove picture from DB
    await Picture.destroy({ where: { product_id: productId } })
  } catch (error) {
    throw error
  }
}

const uploadProfileImage = async (image, userId) => {
  if (!image) return

  try {
    // Remove existing profile picture
    await deleteProfileImage(userId)

    const newPictureName = v4()

    const imageExt = image.mimetype.replace("image/", "")
    const imageName = `${newPictureName}.${imageExt}`
    const imagePath = `profiles/${imageName}`

    // Upload picture
    // await admin.storage().bucket().file(imagePath).save(image.buffer);

    // await admin.storage().bucket().file(imagePath).makePublic();

    // const publicUrl = admin.storage().bucket().file(imagePath).publicUrl();

    const { data, error } = await supabase.storage.from("secondhand").upload(imagePath, blob)
    console.log(data)
    console.log(error)

    const { publicURL, error: urlError } = supabase.storage
      .from("secondhand")
      .getPublicUrl(imagePath)
    console.log(publicURL)
    console.log(urlError)

    // Add picture to DB
    await UserBiodata.update(
      {
        picture: publicURL,
      },
      {
        where: {
          user_id: userId,
        },
      }
    )
  } catch (error) {
    throw error
  }
}

const deleteProfileImage = async (userId) => {
  try {
    const userBio = await UserBiodata.findOne({
      where: {
        user_id: userId,
      },
    })

    if (!userBio || !userBio.picture) return

    const pictureName = userBio.picture
      .replace(
        "https://storage.googleapis.com/final-project-binar-d4a7b.appspot.com/profiles%2F",
        ""
      )
      .trim()

    const imagePath = `profiles/${pictureName}`

    // await admin
    //   .storage()
    //   .bucket()
    //   .file(imagePath)
    //   .delete({ ignoreNotFound: true });

    await supabase.storage.from("bucket").remove(imagePath)

    await UserBiodata.update(
      {
        picture: null,
      },
      {
        where: {
          user_id: userId,
        },
      }
    )
  } catch (error) {
    throw error
  }
}

module.exports = {
  validatePicture,
  uploadProductImages,
  updateProductImages,
  deleteProductImages,
  uploadProfileImage,
}
