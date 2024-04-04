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
- Identifying an anime from an image
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

const jikanTypeList =
  '["tv", "movie" ,"ova" ,"special", "ona", "music","cm", "pv"," tv_special", "manga", "novel", "lightnovel", "oneshot", "doujin", "manhwa", "manhua"]';

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
      case 4:
        handleIdentifyImage(payload, state, tools);
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
  var {
    isTrendingAnimeRequested,
    isTrendingMangaRequested,
    isGenreRequested,
    genreReq,
  } = state;

  // get user's response, convert to lower case
  var response = payload.toLowerCase().trim();

  if (!isTrendingAnimeRequested && !isTrendingMangaRequested) {
    var request = await tools.getUserWants(
      { userMessage: response },
      { memory: tools.getChatHistory(10) }
    );
    // if satisfy one of the functions
    // this is done so that the chat bot wont reply "trending anime" / "trending manga"
    if (request === "trending anime") {
      tools.reply(
        `We detected that you want to get ${request}. Is that correct?`
      );
      state.isTrendingAnimeRequested = true;
    } else if (request === "trending manga") {
      tools.reply(
        `We detected that you want to get ${request}. Is that correct?`
      );
      state.isTrendingMangaRequested = true;
    } else {
      tools.reply(request);
    }
  }

  // ask for genre
  if (
    (isTrendingAnimeRequested || isTrendingMangaRequested) &&
    !isGenreRequested
  ) {
    const genre = await tools.getGenre(
      { userMessage: response },
      { memory: tools.getChatHistory(5) }
    );
    if (genreList.includes(genre) || positive.includes(response)) {
      state.genreReq = genre;
      // if got preference
      if (genreReq === `` || genreReq === null) {
        tools.reply(genre);
      } else if (state.genreReq !== `anything`) {
        tools.reply(
          `We detected that the genre you want is ${state.genreReq}. Is that correct?`
        );
        state.isGenreRequested = true;
      } else {
        tools.reply(
          `We will provide trending anime/manga for all genres. Is that ok?`
        );
        state.isGenreRequested = true;
      }
    } else {
      tools.reply("Let me know what more you want to query!");
      resetState(state);
    }
  }

  //////////////////////////////////////////////get trending anime/////////////////////////////////////////////////
  if (isTrendingAnimeRequested && isGenreRequested) {
    if (positive.includes(response)) {
      // get trending anime from api
      getTrendingAnime = await getTrending(
        genreReq,
        isTrendingAnimeRequested,
        isTrendingMangaRequested
      );

      // if no error detected, generate top 5 anime
      if (!getTrendingAnime.includes("Error")) {
        // convert to Javascript object
        const trendingAnime = JSON.parse(getTrendingAnime);
        tools.reply(
          `Here are the top 5 anime that are trending for ${genreReq} right now!`
        );
        for (let i = 0; i < 5; i++) {
          const animeInfo = trendingAnime["data"][i]["attributes"];
          top5Anime = `Title: ${animeInfo["titles"]["en_jp"]} 
            Sypnosis: ${animeInfo["synopsis"]} \n
            Average Rating: ${animeInfo["averageRating"]} \n
            Status: ${animeInfo["status"]} \n
            No. of Episodes: ${animeInfo["episodeCount"]}`;
          tools.reply(await tools.formatMessage({ content: top5Anime }));
        }
      }
      // if error detected, return error message and try again
      else {
        tools.reply(getTrendingAnime);
      }
    }
    // done generating trending anime
    tools.reply("Let me know what more you want to query!");
    resetState(state);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////get trending manga/////////////////////////////////////////////////
  if (isTrendingMangaRequested && isGenreRequested) {
    if (positive.includes(response)) {
      // get trending anime from api
      getTrendingManga = await getTrending(
        genreReq,
        isTrendingAnimeRequested,
        isTrendingMangaRequested
      );
      // if no error detected, generate top 5 anime
      if (!getTrendingManga.includes("Error")) {
        // convert to Javascript object
        const trendingManga = JSON.parse(getTrendingManga);
        tools.reply(
          `Here are the top 5 manga that are trending for ${genreReq} right now!`
        );
        for (let i = 0; i < 5; i++) {
          const mangaInfo = trendingManga["data"][i]["attributes"];
          top5Manga = `Title: ${mangaInfo["canonicalTitle"]} 
            Sypnosis: ${mangaInfo["synopsis"]} \n
            Average Rating: ${mangaInfo["averageRating"]} \n
            Status: ${mangaInfo["status"]} \n
            No. of Volumes: ${mangaInfo["volumeCount"]}
            No. of Chapter: ${mangaInfo["chapterCount"]}`;
          tools.reply(await tools.formatMessage({ content: top5Manga }));
        }
      }
      // if error detected, return error message and try again
      else {
        tools.reply(getTrendingManga);
      }
    }
    // done generating trending anime
    tools.reply("Let me know what more you want to query!");
    resetState(state);
  }
  async function getTrending(
    genreChoice,
    isTrendingAnimeRequested,
    isTrendingMangaRequested
  ) {
    if (isTrendingAnimeRequested) {
      var apiURL = `https://kitsu.io/api/edge/anime?`;
    } else if (isTrendingMangaRequested) {
      var apiURL = `https://kitsu.io/api/edge/manga?`;
    }
    if (genreChoice !== "null") {
      apiURL = apiURL + `filter[categories]=${genreChoice}`;
    }
    try {
      const trending = await fetch(apiURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
      });
      const trendingManga = await trending.text();
      return trendingManga;
    } catch (error) {
      const errorMsg = `Error fetching trending manga: ${error}`;
      console.error(errorMsg);
      return errorMsg;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
}

// HANDLE SEARCH
async function handleSearch(payload, state, tools) {
  /*
  This function extracts out the details from the user's message and tries to find related information.
  If an anime is specified -> return that info
  If an anime is 'described' and a guess is made -> return that info + others?
  Else if genres -> return a list of animes suiting the genre
  */
  // Extract detected of Genres
  const { genres } = JSON.parse(
    await tools.genreExtracter({
      userMessage: payload,
    })
  );

  // console.log("handleSearch, genres: ", genres);
  let validGenres = [];
  let invalidGenres = [];
  // keep valid genres
  for (let g of genres) {
    if (jikanGenres.includes(g.toLowerCase())) validGenres.push(g);
    else invalidGenres.push(g);
  }

  // console.log("handleSearch, validGenres: ", validGenres);

  // Match Genre Ids
  let genre_ids = matchGenreWithMalIDs(validGenres);

  // console.log("In handleSearch, genre_ids: ", genre_ids);

  // Get details
  const res_ai = JSON.parse(
    await tools.searchHelper(
      { userMessage: payload, genres: validGenres, genre_ids: genre_ids },
      {
        memory: tools.getChatHistory(0),
        externalTools: {
          genreList: () => {
            return JSON.stringify(jikanGenresMapping);
          },
          getTypeList: () => {
            return jikanTypeList;
          },
        },
      }
    )
  );

  // is_guess => LLM guessed the NAME of the anime
  // name_detected => LLM detected a name in user's request
  // genre_detected => LLM detected a genre in user's request
  console.log("handleSearch: ", res_ai);

  // Check res_ai
  if (!res_ai.hasOwnProperty("target")) {
    tools.reply(
      "I'm sorry. I did not quite understand your request. Perhaps you can try phrasing it differently?"
    );
  } else {
    const {
      is_guess,
      name_detected,
      genre_detected,
      target,
      name,
      type,
      status,
      genre_names,
      genre_ids,
    } = res_ai;

    // Returns ?queries
    try {
      let query = formQueryParams(invalidGenres, res_ai, tools);
      let api = `${jikanBaseApi}/${target}?${query}`;

      console.log("handleSearch, API: ", api);

      const res = await fetch(api);
      const res_json = await res.json();
      const data = res_json.data;
      console.log("handleSearch, data: ", data);

      if (data.length === 0) {
        tools.reply(
          `I'm sorry but I cannot find any information regarding what you are looking for...`
        );
      } else {
        // Name detected
        if (name_detected && !is_guess) {
          tools.reply(`Here is more information about the ${target} _${name}_`);
          await formatInfoResponse(data[0], tools);
        } else if (is_guess) {
          tools.reply(`You may be thinking of the ${target} _${name}_`);
          // Get first
          await formatInfoResponse(data[0], tools);
          // Other
          tools.reply(`Other relevant ${target} may be:`);
          // Loop
          cur_idx = 1;
          while (cur_idx < data.length && cur_idx < 4) {
            await formatInfoResponse(data[cur_idx], tools);
            cur_idx++;
          }
        }
        // No Name detected
        else if (genre_detected) {
          tools.reply(
            `Based on your description, here are some ${target} that may be of interest:`
          );
          cur_idx = 0;
          while (cur_idx < data.length && cur_idx < 4) {
            await formatInfoResponse(data[cur_idx], tools);
            cur_idx++;
          }
        } else {
          tools.reply(
            `I'm afraid I do not understand your request. Try specifying a genre or describing the ${target}.`
          );
        }
      }
    } catch (e) {
      console.log("Error in handleSearch: ", e);
      tools.reply(
        "Oops... It appears something has gone wrong. Please try again."
      );
    }
  }
  resetState(state, tools);
}

function matchGenreWithMalIDs(genres) {
  ids = [];
  jikanGenresMapping.genres.forEach((g) => {
    if (genres.includes(g.genre)) {
      ids.push(g.mal_id);
    }
  });
  return ids;
}

function formQueryParams(
  invalidGenres,
  {
    is_guess,
    name_detected,
    genre_detected,
    target,
    name,
    type,
    status,
    genre_names,
    genre_ids,
  },
  tools
) {
  let base = `type=${type}`;
  if (status) {
    base += `&status=${status}`;
  }
  // Name detected
  if (name_detected && !is_guess) {
    return `${base}&q=${name}`;
  } else if (is_guess) {
    return `${base}&q=${name}`;
  }
  // No Name detected
  else if (genre_detected) {
    genres_string = genre_ids.join(",");
    invalidGenresString = invalidGenres.join(",");
    return invalidGenres.length === 0
      ? `${base}&genres=${genres_string}`
      : `${base}&q=${invalidGenresString}&genres=${genres_string}`;
  }
}

async function formatInfoResponse(content, tools) {
  let formatted_info = await tools.formatMessage({
    content: JSON.stringify(content),
  });
  // console.log(formatted_info);
  tools.reply(formatted_info);
}

// HANDLE QUOTE
async function handleGetQuote(payload, state, tools) {
  console.log("In handleGetQuote; ", state);
  tools.reply();
  resetState(state, tools);
}

// HANDLE IMAGE ID
async function handleIdentifyImage(payload, state, tools) {
  resetState(state, tools);
  return;
}
