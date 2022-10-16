import { type } from "os";

const get5LetterWords = require('./get5LetterWords');

test('produce whole alphabet', () => {
    expect(get5LetterWords.produceAlphabet()).toMatchObject([
        'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x',
        'y', 'z'
      ]);
});
