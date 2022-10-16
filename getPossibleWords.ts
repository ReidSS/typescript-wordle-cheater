// Run this file by running command: npm run words
import { readFileSync } from 'fs';

// get list of all 5 letter words from data folder
function readListOfWordsFile() {
    let words = readFileSync('data/allWords.json').toString().replace(/[^a-zA-Z0-9 ,]/g, '').split(',');
    return words;
}

// Replace the letters and their positions here with the letters you have
// selected in your wordle game. 
// The letters below match what should be input for test_image.PNG
const green_letters: [string, number][] = [['o', 2]];
const yellow_letters: [string, number][] = [['d', 0], ['r', 1], ['e', 2], ['a', 3]];
const gray_letters = ['g', 'h', 's', 't', 'm'];

function getPossbileWords(green_letters: [string, number][], yellow_letters: [string, number][], gray_letters: string[]) {
    const allWords = readListOfWordsFile();

    let greenWords: string[] = [];
    let yellowWords: string[] = [];
    let finalWords: string[] = [];

    // loop through each word in allWords, only populating greenWords with
    // words that include each green letter in the position listed in their 
    // entry in green_letters
    allWords.forEach((aWord) => {
        let containsAllLetters = true;
        green_letters.forEach((gl) => {
            if(aWord.charAt(gl[1]) !== gl[0]){
                containsAllLetters = false;
            }
        });
        
        if(containsAllLetters){
            greenWords.push(aWord);
        }
    });
    // loop through each word in greenWords, only populating yellowWords with
    // words that include all yellow letters in positions NOT listed in their 
    // entry in yellow_letters
    greenWords.forEach((gWord) => {
        let containsAllLetters = true;
        yellow_letters.forEach((yl) => {
            if(!gWord.includes(yl[0])){
                containsAllLetters = false;
            }
            if(gWord.charAt(yl[1]) === yl[0]){
                containsAllLetters = false;
            }
        });

        if(containsAllLetters){
            yellowWords.push(gWord);
        }
    })

    // loop through each word in yellowWords, populating finalWords with
    // words that do NOT include all letters in grey_letters. 
    yellowWords.forEach((yWord) => {
        let containsGrayLetter = false;
        gray_letters.forEach((gl) => {
            if(yWord.includes(gl[0])){
                containsGrayLetter = true;
            }
        });
        if(!containsGrayLetter){
            finalWords.push(yWord);
        }
    });

    return finalWords;
}

console.log(getPossbileWords(green_letters, yellow_letters, gray_letters));