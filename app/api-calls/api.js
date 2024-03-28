import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API;

export const saveFile = async (data) => {
  let fileData = {};
  console.log("ddd", data);
  try {
    await axios.post(`${BASE_URL}/api/v1/file/`, data).then((response) => {
      fileData = response?.fileData;
    });
  } catch (error) {
    console.log("err", error);
  } finally {
    return fileData;
  }
};

export const getAllFiles = async () => {
  let fileData = {};
  try {
    await axios.get(`${BASE_URL}/api/v1/file/`).then((response) => {
      fileData = response?.data?.fileData;
    });
  } catch (error) {
    console.log("err", error);
  } finally {
    return fileData;
  }
};
