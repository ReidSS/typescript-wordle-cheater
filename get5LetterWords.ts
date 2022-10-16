import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';

function saveData(filename: string, data: any) {
    if (!existsSync(resolve(__dirname, 'data'))) {
      mkdirSync('data');
    }
    writeFile(resolve(__dirname, `data/${filename}.json`), JSON.stringify(data), {
      encoding: 'utf8',
    });
  }

function fetchPage(url: string): Promise<string | undefined> {
  console.log("url: ", url);
  console.log('type', typeof(url));
  const HTMLData = axios
    .get(url)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      console.error(error.toJSON());
    });

  return HTMLData;
}

async function fetchFromWebOrCache(url: string, ignoreCache = false) {
  // If the cache folder doesn't exist, create it
  if (!existsSync(resolve(__dirname, '.cache'))) {
    mkdirSync('.cache');
  }
  console.log(`Getting data for ${url}...`);
  if (
    !ignoreCache &&
    existsSync(
      resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
    )
  ) {
    console.log(`I read ${url} from cache`);
    const HTMLData = await readFile(
      resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
      { encoding: 'utf8' },
    );
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  } else {
    console.log(`I fetched ${url} fresh`);
    const HTMLData = await fetchPage(url);
    //console.log(HTMLData);
    if (!ignoreCache && HTMLData) {
      writeFile(
        resolve(
          __dirname,
          `.cache/${Buffer.from(url).toString('base64')}.html`,
        ),
        HTMLData,
        { encoding: 'utf8' },
      );
    }
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  }
}

function extractData(document: Document) {
    const wordList: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll('a.wordWrapper'),
    );
    return wordList.map(word => {
      return word.text.substring(0,5);
    });
}

function produceAlphabet() {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());
    return alphabet;
}

async function getData(letter: String) {
    const document = await fetchFromWebOrCache(
      `https://scrabblewordfinder.org/5-letter-words-starting-with/${letter}`,
      false, 
    );

    const data = extractData(document);
    
    return data;
}

  
// loop through alphabet and construct list. Will need to flatten list and put into file. 
async function constructWholeList() {
    const alphabet = produceAlphabet();
    var listOfWords: String[] = [];

    const words = alphabet.map(getData);

    Promise.all(words).then((values) => {
        listOfWords = values.reduce((accumulator, value) => accumulator.concat(value), []);
        
        saveData('allWords', listOfWords);
    });
}

module.exports = { produceAlphabet};

// uncomment below to get whole list of 5 letter words.

constructWholeList();