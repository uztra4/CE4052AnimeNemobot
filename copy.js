/** Handle the user message.
 * @param {string} payload the message sent by user
 * @param {AppState} state the state of the app
 * @param {Tool} tools available tools to perform a task
 */
// APIs
jikanBaseApi = `https://api.jikan.moe/v4`;

// CONSTANTS
const defaultState = {
  currentReq: null, // current user's request
  isTrendingAnimeRequested: false, //if trending anime is requested
  isTrendingMangaRequested: false, //if trending anime is requested
  isGenreRequested: false, //if genre is asked
  genreReq: null, //store the preferred genre
  quoteReq: null, //store what kind of quote request they want
};

const genreList = [
  "anything",
  "Comedy",
  "Romance",
  "Fantasy",
  "Action",
  "Drama",
  "School Life",
  "Adventure",
  "Slice of Life",
  "Yaoi",
  "Science Fiction",
  "Shoujo Ai",
  "Ecchi",
  "Sports",
  "Historical",
  "Music",
  "Magic",
  "Mystery",
  "Supernatural",
  "Harem",
  "Japan",
  "Psychological",
  "Thriller",
  "Shounen",
  "Earth",
  "Horror",
  "Kids",
  "Seinen",
  "Present",
  "Shounen Ai",
  "Martial Arts",
  "Asia",
  "Shoujo",
  "Isekai",
  "Mecha",
  "Demon",
  "Super Power",
  "Fantasy World",
  "Violence",
  "Military",
  "Josei",
];
// anything that prompts that the bot is going the right direction
// can just declare as positive.includes(response)
const positive = ["ok", "sure", "correct", "fine", "yes"];

const reqList = `
- Providing trending anime or manga based on genre, rating etc. 
- Searching information about an anime/manga
- Getting a random anime quote
`;

const jikanGenresMapping = {
  genres: [
    { mal_id: 1, genre: "Action" },
    { mal_id: 2, genre: "Adventure" },
    { mal_id: 5, genre: "Avant Garde" },
    { mal_id: 46, genre: "Award Winning" },
    { mal_id: 28, genre: "Boys Love" },
    { mal_id: 4, genre: "Comedy" },
    { mal_id: 8, genre: "Drama" },
    { mal_id: 10, genre: "Fantasy" },
    { mal_id: 26, genre: "Girls Love" },
    { mal_id: 47, genre: "Gourmet" },
    { mal_id: 14, genre: "Horror" },
    { mal_id: 7, genre: "Mystery" },
    { mal_id: 22, genre: "Romance" },
    { mal_id: 24, genre: "Sci-Fi" },
    { mal_id: 36, genre: "Slice of Life" },
    { mal_id: 30, genre: "Sports" },
    { mal_id: 37, genre: "Supernatural" },
    { mal_id: 41, genre: "Suspense" },
    { mal_id: 9, genre: "Ecchi" },
    { mal_id: 49, genre: "Erotica" },
    { mal_id: 12, genre: "Hentai" },
    { mal_id: 50, genre: "Adult Cast" },
    { mal_id: 51, genre: "Anthropomorphic" },
    { mal_id: 52, genre: "CGDCT" },
    { mal_id: 53, genre: "Childcare" },
    { mal_id: 54, genre: "Combat Sports" },
    { mal_id: 81, genre: "Crossdressing" },
    { mal_id: 55, genre: "Delinquents" },
    { mal_id: 39, genre: "Detective" },
    { mal_id: 56, genre: "Educational" },
    { mal_id: 57, genre: "Gag Humor" },
    { mal_id: 58, genre: "Gore" },
    { mal_id: 35, genre: "Harem" },
    { mal_id: 59, genre: "High Stakes Game" },
    { mal_id: 13, genre: "Historical" },
    { mal_id: 60, genre: "Idols (Female)" },
    { mal_id: 61, genre: "Idols (Male)" },
    { mal_id: 62, genre: "Isekai" },
    { mal_id: 63, genre: "Iyashikei" },
    { mal_id: 64, genre: "Love Polygon" },
    { mal_id: 65, genre: "Magical Sex Shift" },
    { mal_id: 66, genre: "Mahou Shoujo" },
    { mal_id: 17, genre: "Martial Arts" },
    { mal_id: 18, genre: "Mecha" },
    { mal_id: 67, genre: "Medical" },
    { mal_id: 38, genre: "Military" },
    { mal_id: 19, genre: "Music" },
    { mal_id: 6, genre: "Mythology" },
    { mal_id: 68, genre: "Organized Crime" },
    { mal_id: 69, genre: "Otaku Culture" },
    { mal_id: 20, genre: "Parody" },
    { mal_id: 70, genre: "Performing Arts" },
    { mal_id: 71, genre: "Pets" },
    { mal_id: 40, genre: "Psychological" },
    { mal_id: 3, genre: "Racing" },
    { mal_id: 72, genre: "Reincarnation" },
    { mal_id: 73, genre: "Reverse Harem" },
    { mal_id: 74, genre: "Romantic Subtext" },
    { mal_id: 21, genre: "Samurai" },
    { mal_id: 23, genre: "School" },
    { mal_id: 75, genre: "Showbiz" },
    { mal_id: 29, genre: "Space" },
    { mal_id: 11, genre: "Strategy Game" },
    { mal_id: 31, genre: "Super Power" },
    { mal_id: 76, genre: "Survival" },
    { mal_id: 77, genre: "Team Sports" },
    { mal_id: 78, genre: "Time Travel" },
    { mal_id: 32, genre: "Vampire" },
    { mal_id: 79, genre: "Video Game" },
    { mal_id: 80, genre: "Visual Arts" },
    { mal_id: 48, genre: "Workplace" },
    { mal_id: 43, genre: "Josei" },
    { mal_id: 15, genre: "Kids" },
    { mal_id: 42, genre: "Seinen" },
    { mal_id: 25, genre: "Shoujo" },
    { mal_id: 27, genre: "Shounen" },
  ],
};

const jikanGenres = [
  "action",
  "adventure",
  "avant garde",
  "award winning",
  "boys love",
  "comedy",
  "drama",
  "fantasy",
  "girls love",
  "gourmet",
  "horror",
  "mystery",
  "romance",
  "sci-fi",
  "slice of life",
  "sports",
  "supernatural",
  "suspense",
  "ecchi",
  "erotica",
  "hentai",
  "adult cast",
  "anthropomorphic",
  "cgdct",
  "childcare",
  "combat sports",
  "crossdressing",
  "delinquents",
  "detective",
  "educational",
  "gag humor",
  "gore",
  "harem",
  "high stakes game",
  "historical",
  "idols (female)",
  "idols (male)",
  "isekai",
  "iyashikei",
  "love polygon",
  "magical sex shift",
  "mahou shoujo",
  "martial arts",
  "mecha",
  "medical",
  "military",
  "music",
  "mythology",
  "organized crime",
  "otaku culture",
  "parody",
  "performing arts",
  "pets",
  "psychological",
  "racing",
  "reincarnation",
  "reverse harem",
  "romantic subtext",
  "samurai",
  "school",
  "showbiz",
  "space",
  "strategy game",
  "super power",
  "survival",
  "team sports",
  "time travel",
  "vampire",
  "video game",
  "visual arts",
  "workplace",
  "josei",
  "kids",
  "seinen",
  "shoujo",
  "shounen",
];

const jikanTypeList = {
  anime: [
    "tv",
    "movie",
    "ova",
    "special",
    "ona",
    "music",
    "cm",
    "pv",
    "tv_special",
  ],
  manga: [
    "manga",
    "novel",
    "lightnovel",
    "oneshot",
    "doujin",
    "manhwa",
    "manhua",
  ],
};
async function run(payload, state, tools) {
  // console.log("In Run: ", state)
  try {
    if (!state.currentReq) {
      res = await tools.understandUserReq({ userMessage: payload });
      // console.log(res);
      state.currentReq = JSON.parse(res);
    }

    console.log("In run, request detected: ", state.currentReq);

    switch (state.currentReq.req_num) {
      case 1:
        handleTrending(payload, state, tools);
        break;
      case 2:
        handleSearch(payload, state, tools);
        break;
      case 3:
        handleGetQuote(payload, state, tools);
        break;
      default:
        handleError(state, tools);
    }
  } catch (e) {
    console.log(e);
    handleError(state, tools);
  }
}

/** Startup.
 * @param {AppState} state the state of the app
 * @param {Tool} tools available tools to perform a task
 */
async function startup(state, tools) {
  tools.reply(`Hello! Welcome to the Anime Query Bot. Here are some
  information I can provide you!
  ${reqList}`);

  // Setting state
  resetState(state);
}

/** Unit test.
 * @param {Test} test define a test case
 * @param {Tool} tools available tools to perform a task
 */
function unitTest(test, tools) {
  test("Test 1", 1, async (expect) => {
    expect(true).toBeTrue();
  });
}

async function handleError(state, tools) {
  tools.reply(`I'm sorry, I do not understand your request. Here is a list of topics I can assist you in:
  ${reqList}`);

  resetState(state);
}

function resetState(state) {
  for (let key in defaultState) {
    state[key] = defaultState[key];
  }
  console.log("Reset done.", state);
}

// HANDLE TRENDING
async function handleTrending(payload, state, tools) {
  console.log("In handletrending; ", state);
  const apiURL = `https://kitsu.io/api/edge/`;
  const trendingReq = await tools.trendingReq(
    { userMessage: payload },
    { memory: tools.getChatHistory(5) }
  );
  console.log(trendingReq);

  try {
    const trendingReqJSON = JSON.parse(trendingReq);
    const trendingData = await getTrending(trendingReq);
    const updatedTime = new Date(
      JSON.parse(trendingData)["data"][0]["attributes"]["updatedAt"]
    );
    if (trendingReqJSON["req"] === "trending") {
      if (trendingReqJSON["genre"] !== null) {
        tools.reply(
          `We cannot provide trending ${trendingReqJSON["type"]} right now.`
        );
      }
    }
    tools.reply(`Generating 5 ${trendingReqJSON["req"]} ${
      trendingReqJSON["type"]
    } now!\n
    Information updated on ${updatedTime.toDateString()} ${updatedTime.toLocaleTimeString()}`);
    for (let i = 0; i < 5; i++) {
      const topData = JSON.parse(trendingData)["data"][i]["attributes"];
      // some titles not included in the data hence need to define manually
      if (typeof topData["canonicalTitle"] !== "undefined") {
        var title = topData["canonicalTitle"];
      } else if (typeof topData["titles"]["en"] !== "undefined") {
        var title = topData["titles"]["en"];
      } else if (typeof topData["titles"]["en_jp"] !== "undefined") {
        var title = topData["titles"]["en_jp"];
      } else if (typeof topData["titles"]["en_us"] !== "undefined") {
        var title = topData["titles"]["en_us"];
      }
      var [volCount, chapCount] = [
        topData["volumeCount"],
        topData["chapterCount"],
      ];
      if (
        trendingReqJSON["type"] === "manga" &&
        (volCount === null || chapCount === null)
      ) {
        [volCount, chapCount] = await getChapterVolume(title);
      }
      if (trendingReqJSON["type"] === "anime") {
        info = `Title: ${title}\n
        Image: ${topData["posterImage"]["small"]}\n 
        Sypnosis: ${topData["synopsis"]} \n
        Average Rating: ${topData["averageRating"]} \n
        Status: ${topData["status"]} \n
        No. of Episodes: ${topData["episodeCount"]}\n
        Trailer Link: ${topData["youtubeVideoId"]}`;
      } else if (trendingReqJSON["type"] === "manga") {
        info = `Title: ${title}\n
        Image: ${topData["posterImage"]["small"]}\n 
        Sypnosis: ${topData["synopsis"]} \n
        Average Rating: ${topData["averageRating"]} \n
        Status: ${topData["status"]} \n
        No. of Volumes: ${volCount}\n
        No. of Chapter: ${chapCount}`;
      }
      tools.reply(await tools.formatMessage({ content: info }));
    }
    tools.reply(`Let me know what more you want to query!`);
  } catch (error) {
    console.log(error);
    tools.reply(trendingReq);
  }

  async function getChapterVolume(title) {
    console.log(title);
    const apiURL = `https://api.mangadex.org/manga?title=${title}`;
    try {
      const mangaInfo = await fetch(apiURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const mangaInfoText = await mangaInfo.text();
      const mangaInfoJson = JSON.parse(mangaInfoText)["data"][0]["attributes"];
      console.log([mangaInfoJson["lastVolume"], mangaInfoJson["lastChapter"]]);
      return [mangaInfoJson["lastVolume"], mangaInfoJson["lastChapter"]];
    } catch (error) {
      const errorMsg = `Error fetching trending manga: ${error}`;
      console.error(errorMsg);
      return errorMsg;
    }
  }
  async function getTrending(trendingReq) {
    try {
      const trendingReqJSON = JSON.parse(trendingReq);
      switch (trendingReqJSON["req"]) {
        case "top":
          apiURLSearch = apiURL + trendingReqJSON["type"];
          if (trendingReqJSON["genre"] === null) {
            apiURLSearch = apiURLSearch;
          } else {
            apiURLSearch =
              apiURLSearch + `?filter[categories]=${trendingReqJSON["genre"]}`;
          }
          break;
        case "trending":
          var apiURLSearch = apiURL + `trending/` + trendingReqJSON["type"];
          break;
      }
    } catch (error) {
      tools.reply(trendingReq);
    }
    console.log(apiURLSearch);
    try {
      const trending = await fetch(apiURLSearch, {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
      });
      const trendingText = await trending.text();
      return trendingText;
    } catch (error) {
      const errorMsg = `Error fetching trending manga/anime: ${error}`;
      console.error(errorMsg);
      return errorMsg;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
}

const searchResponseType = {
  NAME: "NAME",
  GENRE: "GENRE",
  STATUS: "STATUS",
  GUESS: "GUESS",
};

const statusType = {
  AIRING: "airing",
  COMPLETE: "complete",
  UPCOMING: "upcoming",
};

async function handleSearch(payload, state, tools) {
  /*
  This function extracts out the details from the user's message and tries to find related information.
  If an anime is specified -> return that info
  If an anime is 'described' and a guess is made -> return that info + others?
  Else if genres -> return a list of animes suiting the genre
  */
  // Extract detected of Genres
  const { validGenres, invalidGenres, genre_ids } = await handleExtractGenres(
    payload,
    tools
  );

  // console.log(genre_ids);
  // Get status
  const status_res = JSON.parse(
    await tools.statusExtractor({ userMessage: payload })
  );
  // console.log("handleSearch, status: ", status_res);

  // Get details
  const res_ai = JSON.parse(
    await tools.searchHelper(
      { userMessage: payload },
      {
        memory: tools.getChatHistory(0),
        externalTool: {
          getTypeList: () => {
            return `${jikanTypeList}`;
          },
        },
      }
    )
  );

  console.log(
    "handleSearch: ",
    res_ai,
    "\nStatus: ",
    status_res,
    `\nValidG: ${validGenres}\nInvalidG: ${invalidGenres}`
  );

  // Check res_ai
  if (!res_ai.hasOwnProperty("target")) {
    tools.reply(
      "I'm sorry. I did not quite understand your request. Perhaps you can try phrasing it differently?"
    );
  } else {
    const { is_guess, name_detected, target, name, type } = res_ai;
    // Returns ?queries
    try {
      let { queryName, queryGenre, switch_exp } = formQueryParams(
        invalidGenres,
        res_ai,
        status_res.status,
        genre_ids,
        tools
      );

      let api_base = `${jikanBaseApi}/${target}?`;

      let data;
      let noDataMessage =
        "I'm sorry, but I am unable to find information regarding your request.";
      switch (switch_exp) {
        case searchResponseType.STATUS: // Detected status related query
          data = await jikanQuery(api_base + queryGenre);
          if (data.length > 0) {
            tools.reply(
              `I've found some ${status_res.status} ${target} that may interest you:`
            );
            cur_idx = 0;
            while (cur_idx < data.length && cur_idx < 4) {
              await formatInfoResponse(data[cur_idx], tools);
              cur_idx++;
            }
          } else tools.reply(noDataMessage);

          break;
        case searchResponseType.NAME: // Name detected
          data = await jikanQuery(api_base + queryName);
          if (data.length > 0) {
            tools.reply(
              `Here is more information about the ${target} _${name}_`
            );
            await formatInfoResponse(data[0], tools);
          } else tools.reply(noDataMessage);
          break;
        case searchResponseType.GUESS: // Name guessed
          tools.reply(`You may be thinking of the ${target} _${name}_`);
          data = await jikanQuery(api_base + queryName);
          // Get first
          await formatInfoResponse(data[0], tools);
          // Other
          if (queryGenre) {
            let data2 = await jikanQuery(api_base + queryGenre);
            if (data2.length > 0) {
              tools.reply(`Other relevant ${target} may be:`);
              // Loop
              cur_idx = 0;
              while (cur_idx < data2.length && cur_idx < 3) {
                await formatInfoResponse(data2[cur_idx], tools);
                cur_idx++;
              }
            }
          }
          break;
        case searchResponseType.GENRE: // No Name detected -> Use Genre
          data = await jikanQuery(api_base + queryGenre);
          if (data.length > 0) {
            tools.reply(
              `Based on your description, here are some ${target} that may be of interest:`
            );
            cur_idx = 0;
            while (cur_idx < data.length && cur_idx < 4) {
              await formatInfoResponse(data[cur_idx], tools);
              cur_idx++;
            }
          } else tools.reply(noDataMessage);
          break;
        default:
          tools.reply(
            `I'm afraid I do not understand your request. Try specifying a genre or describing the ${target}.`
          );
      }
    } catch (e) {
      console.log("Error in handleSearch: ", e);
      tools.reply(
        "Oops... It appears something has gone wrong. Please try again."
      );
    }
  }
  tools.reply("Please let me know if you require anymore assistance!");
  resetState(state, tools);
}

async function handleExtractGenres(payload, tools) {
  const { genres, thought } = JSON.parse(
    await tools.genreExtractor(
      {
        userMessage: payload,
      },
      {
        memory: tools.getChatHistory(1),
        externalTool: {
          getGenreList: () => {
            return `The genres are ${jikanGenres}`;
          },
          getIgnoreList: () => {
            // return undefined;
            return `You must never include these words ${jikanTypeList} and 'anime'`;
          },
        },
      }
    )
  );
  // console.log("handleExtractGenres, genres: ", genres);
  // console.log("handleExtractGenres, thought: ", thought);
  let validGenres = [];
  let invalidGenres = [];
  // keep valid genres
  for (let g of genres) {
    if (jikanGenres.includes(g.toLowerCase()))
      validGenres.push(g.toLowerCase());
    else if (
      !jikanTypeList.anime.includes(g.toLowerCase()) &&
      !jikanTypeList.manga.includes(g.toLowerCase()) &&
      g.toLowerCase() !== "anime"
    ) {
      invalidGenres.push(g);
    }
  }

  // console.log("handleExtractGenres, validGenres: ", validGenres);
  // console.log("handleExtractGenres, invalidGenres: ", invalidGenres);

  // Match Genre Ids
  let genre_ids = matchGenreWithMalIDs(validGenres);

  // console.log("In handleExtractGenres, genre_ids: ", genre_ids);

  return { genre_ids, invalidGenres, validGenres };
}

function matchGenreWithMalIDs(genres) {
  ids = [];
  jikanGenresMapping.genres.forEach((g) => {
    if (genres.includes(g.genre.toLowerCase())) {
      ids.push(g.mal_id);
    }
  });
  return ids;
}

function formQueryParams(
  invalidGenres,
  { name_detected, is_guess, target, name, type },
  status,
  genre_ids,
  tools
) {
  let query = `type=${type}`;
  let queryName = null;
  let queryGenre = null;
  let switch_exp = 0;

  // Name detected
  if (name_detected && !is_guess) {
    queryName = `${query}&q=${name}`;
    switch_exp = searchResponseType.NAME;
    if (status === statusType.UPCOMING) {
      queryName += `&status=${status}`;
      // switch_exp = searchResponseType.STATUS;
    }
  } else {
    if (is_guess) {
      queryName = `${query}&q=${name}`;
      switch_exp = searchResponseType.GUESS;
    }
    // For Genre Queries
    if (genre_ids.length !== 0 || invalidGenres.length !== 0) {
      genres_string = genre_ids.join(",");
      invalidGenresString = invalidGenres.join(",");
      queryGenre = query;
      if (genre_ids.length !== 0) {
        queryGenre += `&genres=${genres_string}`;
      }

      if (invalidGenres.length !== 0) {
        queryGenre += `&q=${invalidGenresString}`;
      }

      // If no exp set
      switch_exp = switch_exp === 0 ? searchResponseType.GENRE : switch_exp;
    }

    if (status === statusType.UPCOMING) {
      queryGenre =
        queryGenre === null
          ? `${query}&status=${status}`
          : `${queryGenre}&status=${status}`;
      switch_exp =
        switch_exp !== searchResponseType.GUESS
          ? searchResponseType.STATUS
          : switch_exp;
    }
  }

  return { queryName, queryGenre, switch_exp };
}

async function formatInfoResponse(content, tools) {
  let formatted_info = await tools.formatMessage({
    content: JSON.stringify(content),
  });
  // console.log(formatted_info);
  tools.reply(formatted_info);
}

async function jikanQuery(api) {
  console.log("jikanQuery, api: ", api);
  const res = await fetch(api);
  const res_json = await res.json();
  const data = res_json.data;
  // console.log("jikanQuery, data: ", data);

  return data;
}

// HANDLE QUOTE

async function handleGetQuote(payload, state, tools) {
  console.log("In handleGetQuote; ", state);
  const quoteReq = await tools.quoteReq(
    { userMessage: payload },
    { memory: tools.getChatHistory(5) }
  );
  console.log(quoteReq);
  try {
    const quotes = await getQuote(quoteReq);
    console.log(JSON.parse(quotes)["error"]);
    if (JSON.parse(quotes)["error"] === "No related quotes found!") {
      tools.reply("No related quotes found!");
    } else {
      tools.reply("Generating quote...");
      tools.reply(await tools.formatQuote({ content: quotes })); // Reply with the quotes
      resetState(state);
    }
  } catch (error) {
    tools.reply(quoteReq);
  }

  async function getQuote(quoteReq) {
    quoteReqJson = JSON.parse(quoteReq);
    console.log(quoteReqJson["returnType"]);
    var apiURL = `https://animechan.xyz/api/random/`;
    switch (quoteReqJson["returnType"]) {
      case "random":
        apiURLSearch = `https://animechan.xyz/api/random`;
        break;
      case "anime":
        apiURLSearch = apiURL + `anime?title=` + quoteReqJson["en"];
        break;
      case "character":
        apiURLSearch = apiURL + `character?name=` + quoteReqJson["character"];
        break;
    }
    console.log(apiURLSearch);
    try {
      var response = await fetch(apiURLSearch);
      // Check if the response status is ok
      if (!response.ok) {
        if (quoteReqJson["returnType"] === "anime") {
          apiURLSearch = apiURL + `anime?title=` + quoteReqJson["en_jp"];
          response = await fetch(apiURLSearch);
          console.log(apiURLSearch);
          console.log(response);
        }
      }
      // Parse the response as JSON
      const data = await response.json();
      // Handle the JSON data
      console.log("Data:", data);
      console.log(JSON.stringify(data));
      // Construct quotesData
      return JSON.stringify(data);
    } catch (error) {
      // Handle errors
      console.error("Error fetching data:", error);
      // Return error message
      return "No related quotes found!";
    }
  }
}
