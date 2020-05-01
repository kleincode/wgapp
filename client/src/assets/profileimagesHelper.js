import axios from "../store/axios";

async function fetchProfileImg(id) {
  try {
    const { data, headers } = await axios.get("/_/fetchprofilepicture", {
      responseType: "arraybuffer",
      params: {
        selUid: id
      }
    });
    if (
      headers &&
      headers["content-type"] !== "application/json; charset=utf-8"
    ) {
      const buffer = Buffer.from(data, "binary").toString("base64");
      const imageSource = `data:${headers["content-type"]};base64,${buffer}`;
      return imageSource;
    }
  } catch (err) {
    console.warn(err);
    return null;
  }
}

export { fetchProfileImg };
