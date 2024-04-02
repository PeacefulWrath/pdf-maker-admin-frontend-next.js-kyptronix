import axios from "axios";

export const saveFile = async (formData) => {
  let fileData = {};
  try {
    const response = await axios.post(
      "https://pdf-maker-krypto-backend.onrender.com/api/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("ll", response);
    // fileData=response
  } catch (error) {
    console.log("err", error);
  } finally {
    return fileData;
  }
};
