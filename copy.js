/** Handle the user message.
 * @param {string} payload the message sent by user
 * @param {AppState} state the state of the app
 * @param {Tool} tools available tools to perform a task
 */
// CONSTANTS
const defaultState = {
  "currentReq": null, // current user's request
  "isTrendingAnimeRequested":false, //if trending anime is requested
  "isTrendingMangaRequested":false, //if trending anime is requested
  "isGenreRequested":false, //if genre is asked
  "genreReq":null, //store the preferred genre
  "quoteReq": null, //store what kind of quote request they want
}

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
    "Josei"
];
// anything that prompts that the bot is going the right direction
// can just declare as positive.includes(response)
const positive = ["ok", "sure", "correct", "fine", "yes"];

const reqList = `
- Providing trending anime or manga based on genre, rating etc. 
- Searching information about an anime/manga
- Getting a random anime quote
- Identifying an anime from an image
`

async function run(payload, state, tools) {  
  // console.log("In Run: ", state)
  try{
    if(!state.currentReq){
    res = await tools.understandUserReq({userMessage: payload});
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
  }catch(e){
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

async function handleError(state, tools){
  tools.reply(`I'm sorry, I do not understand your request. Here is a list of topics I can assist you in:
  ${reqList}`);

  resetState(state);
}

function resetState(state){
  for (let key in defaultState) {
   state[key] = defaultState[key];
  }
  console.log("Reset done.", state);
}


// HANDLE TRENDING
async function handleTrending(payload, state, tools){
  console.log("In handletrending; ", state);
  var { isTrendingAnimeRequested, isTrendingMangaRequested, isGenreRequested, genreReq } = state;

  // get user's response, convert to lower case
  var response = payload.toLowerCase().trim();

  if (!isTrendingAnimeRequested && !isTrendingMangaRequested){
    var request = await tools.getUserWants({userMessage: response}, {memory: tools.getChatHistory(10)})
    // if satisfy one of the functions
    // this is done so that the chat bot wont reply "trending anime" / "trending manga"
    if (request === "trending anime"){
      tools.reply(`We detected that you want to get ${request}. Is that correct?`);
      state.isTrendingAnimeRequested = true;
    } else if (request === "trending manga"){
      tools.reply(`We detected that you want to get ${request}. Is that correct?`);
      state.isTrendingMangaRequested = true;
    } else {
      tools.reply(request);
    }
    
  }

  // ask for genre
  if ((isTrendingAnimeRequested || isTrendingMangaRequested) && !isGenreRequested){
    const genre = await tools.getGenre({userMessage: response}, {memory: tools.getChatHistory(5)});
    if (genreList.includes(genre) || positive.includes(response)) {
      state.genreReq = genre;
      // if got preference
      if (genreReq === `` || genreReq === null){
        tools.reply(genre);
      } else if (state.genreReq !== `anything`){
        tools.reply(`We detected that the genre you want is ${state.genreReq}. Is that correct?`);
        state.isGenreRequested = true;
      } else {
        tools.reply(`We will provide trending anime/manga for all genres. Is that ok?`);
        state.isGenreRequested = true;
      }
    } else if (response === "no"){
      tools.reply("Please let us know what you want to query!");
      resetState(state);
    } else {
      tools.reply(genre);
    }
  }

 //////////////////////////////////////////////get trending anime/////////////////////////////////////////////////
  if (isTrendingAnimeRequested && isGenreRequested) {
    if (positive.includes(response)){
      // get trending anime from api
      getTrendingAnime = await getTrending(genreReq, isTrendingAnimeRequested, isTrendingMangaRequested);

      // if no error detected, generate top 5 anime
      if (!(getTrendingAnime.includes('Error'))){
        // convert to Javascript object
        const trendingAnime = JSON.parse(getTrendingAnime);
        tools.reply(`Here are the top 5 anime that are trending for ${genreReq} right now!`);
        for (let i = 0; i < 5; i++) {
          const animeInfo = trendingAnime['data'][i]['attributes'];
            top5Anime = `Title: ${animeInfo['titles']['en_jp']}
            Image: ${(animeInfo['posterImage']['small'])}\n 
            Sypnosis: ${(animeInfo['synopsis'])} \n
            Average Rating: ${animeInfo['averageRating']} \n
            Status: ${animeInfo['status']} \n
            No. of Episodes: ${animeInfo['episodeCount']}`;
            tools.reply(await tools.formatMessage({content: top5Anime})); 
        }
      }
      // if error detected, return error message and try again
      else {
        tools.reply(getTrendingAnime)
      }
    }
    // done generating trending anime
    tools.reply('Let me know what more you want to query!')
    resetState(state);
  }
 //////////////////////////////////////////////////////////////////////////////////////////////////////////

 //////////////////////////////////////////////get trending manga/////////////////////////////////////////////////
  if (isTrendingMangaRequested && isGenreRequested) {
    if (positive.includes(response)){
      // get trending anime from api
      getTrendingManga = await getTrending(genreReq, isTrendingAnimeRequested, isTrendingMangaRequested);
      // if no error detected, generate top 5 anime
      if (!(getTrendingManga.includes('Error'))){
        // convert to Javascript object
        const trendingManga = JSON.parse(getTrendingManga);
        tools.reply(`Here are the top 5 manga that are trending for ${genreReq} right now!`);
        for (let i = 0; i < 5; i++) {
          const mangaInfo = trendingManga['data'][i]['attributes'];
            top5Manga = `Title: ${mangaInfo['canonicalTitle']}\n
            Image: ${(mangaInfo['posterImage']['small'])}\n
            Sypnosis: ${(mangaInfo['synopsis'])} \n
            Average Rating: ${mangaInfo['averageRating']} \n
            Status: ${mangaInfo['status']} \n
            No. of Volumes: ${mangaInfo['volumeCount']}\n
            No. of Chapter: ${mangaInfo['chapterCount']}`;
            tools.reply(await tools.formatMessage({content: top5Manga})); 
        }
      }
      // if error detected, return error message and try again
      else {
        tools.reply(getTrendingManga)
      }
    }
    // done generating trending anime
    tools.reply('Let me know what more you want to query!')
    resetState(state);
  }
  async function getTrending(genreChoice, isTrendingAnimeRequested, isTrendingMangaRequested) {
    if (isTrendingAnimeRequested){
      var apiURL = `https://kitsu.io/api/edge/anime?`;
    }
    else if (isTrendingMangaRequested){
      var apiURL = `https://kitsu.io/api/edge/manga?`;
    }
    if (genreChoice !==  "null"){
      apiURL = apiURL + `filter[categories]=${genreChoice}`;
    }
    try {
      const trending = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      });
      const trendingText = await trending.text();
      console.log(trendingText)
      return trendingText;
    } catch (error) {
      const errorMsg = `Error fetching trending manga/anime: ${error}`;
      console.error(errorMsg);
      return errorMsg;
    }
  }
 //////////////////////////////////////////////////////////////////////////////////////////////////////////  
}


// HANDLE SEARCH
async function handleSearch(payload, state, tools){
  resetState(state);
  return;
}

async function handleGetQuote(payload, state, tools) {
  console.log("In handleGetQuote; ", state);
  const quoteReq = await tools.quoteReq({userMessage: payload}, {memory: tools.getChatHistory(5)});
  console.log(quoteReq);
  try {
    const quotes = await getQuote(quoteReq);
    console.log(JSON.parse(quotes)["error"]);
    if (JSON.parse(quotes)["error"] === "No related quotes found!"){
      tools.reply("No related quotes found!");
    }else{
      tools.reply("Generating quote...");
      tools.reply(await tools.formatMessage({content: quotes})); // Reply with the quotes
      resetState(state);
    }
  } catch (error){
    tools.reply(quoteReq);
  }

  async function getQuote(quoteReq) {
    quoteReqJson = JSON.parse(quoteReq)
    console.log(quoteReqJson['returnType']);
    var apiURL = `https://animechan.xyz/api/random/`;
    switch(quoteReqJson['returnType']) {
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
        if (quoteReqJson['returnType'] === "anime"){
          apiURLSearch = apiURL + `anime?title=` + quoteReqJson["en_jp"];
          response = await fetch(apiURLSearch);
          console.log(apiURL);
          console.log(response);
        }
      }
      // Parse the response as JSON
      const data = await response.json();
      // Handle the JSON data
      console.log('Data:', data);
      console.log(JSON.stringify(data));
      // Construct quotesData
      return JSON.stringify(data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error);
      // Return error message
      return "No related quotes found!";
    }
  }
}

// HANDLE IMAGE ID
async function handleIdentifyImage(payload, state, tools){
  return;
}
