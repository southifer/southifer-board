import axios from "axios";
import { load } from "cheerio";

async function GetImage(input: string): Promise<string | undefined> {
  try {
    const itemList = await axios
      .get(
        "https://thingproxy.freeboard.io/fetch/https://growtopia.fandom.com/api/v1/SearchSuggestions/List?query=" +
          input,
        {
          headers: {
            "Access-Control-Allow-Origin": "*", // Add CORS header
          },
        }
      )
      .then((res) => res.data?.items);

    if (itemList.length === 0) return undefined;

    const itemName = itemList[0].title;
    const link = `https://growtopia.wikia.com/wiki/${itemName}`;

    const getData = (await axios.get(link, {
      headers: {
        "Access-Control-Allow-Origin": "*", // Add CORS header
      },
    })).data;

    const $ = load(getData);

    const Sprite = $("div.card-header .growsprite > img").attr("src");
    if (!Sprite) return undefined;

    return Sprite.replace("webp", "png");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error?.response;
    } else {
      throw error;
    }
  }
}

export default GetImage;
