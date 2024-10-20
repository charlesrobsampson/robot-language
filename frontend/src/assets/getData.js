const msInDay = 86400000;

export async function getTopWords() {
    const storageKey = 'topWords';
    const expireAfterDays = 7;
    const wordsUrl = 'https://raw.githubusercontent.com/first20hours/google-10000-english/refs/heads/master/google-10000-english-usa-no-swears.txt';
    const storedValue = JSON.parse(window.localStorage.getItem(storageKey));
    const timestamp = Date.now();

    if (!storedValue || storedValue.timestamp < timestamp - (expireAfterDays * msInDay)) {
        const wordsResponse = await fetch(wordsUrl);
        const words = (await wordsResponse.text()).split('\n');
        const val = {
            timestamp,
            words
        };
        window.localStorage.setItem(storageKey, JSON.stringify(val));
        return words;
    }
    return storedValue.words;
}

// https://raw.githubusercontent.com/DanielSWolf/wiki-pronunciation-dict/bbad73d8648fe22f4ffbaff72cc1b61ac6c0aabc/dictionaries/en.json
export async function getPronunciationMap() {
    const storageKey = 'pronuncitions';
    const expireAfterDays = 7;
    const pronunciationUrl = 'https://raw.githubusercontent.com/DanielSWolf/wiki-pronunciation-dict/bbad73d8648fe22f4ffbaff72cc1b61ac6c0aabc/dictionaries/en.json';
    const appendedUrl = 'https://raw.githubusercontent.com/charlesrobsampson/en-to-shaw/refs/heads/main/lang/appendedWords.json';
    const storedValue = JSON.parse(window.localStorage.getItem(storageKey));
    const timestamp = Date.now();

    if (!storedValue || storedValue.timestamp < timestamp - (expireAfterDays * msInDay)) {
        const pronunciationRequest = fetch(pronunciationUrl);
        const appendedRequest = fetch(appendedUrl);
        const pronunciationResponse = await pronunciationRequest;
        const appendedResponse = await appendedRequest;
        const pronunciations = await pronunciationResponse.json();
        const toAppend = await appendedResponse.json();
        const val = {
            timestamp,
            pronunciations: {
                ...pronunciations,
                ...toAppend
            }
        };
        window.localStorage.setItem(storageKey, JSON.stringify(val));
        return pronunciations;
    }
    
    return storedValue.pronunciations;
}

export async function getConversionMaps() {
    // https://raw.githubusercontent.com/charlesrobsampson/en-to-shaw/refs/heads/main/lang/maps.js
    const storageKey = 'maps';
    const expireAfterDays = 1;
    const mapsUrl = 'https://raw.githubusercontent.com/charlesrobsampson/en-to-shaw/refs/heads/main/lang/maps.json';
    const storedValue = JSON.parse(window.localStorage.getItem(storageKey));
    const timestamp = Date.now();

    if (!storedValue || storedValue.timestamp < timestamp - (expireAfterDays * msInDay)) {
        const mapsResponse = await fetch(mapsUrl);
        const maps = (await mapsResponse.json());
        const val = {
            timestamp,
            maps
        };
        window.localStorage.setItem(storageKey, JSON.stringify(val));
        return maps;
    }
    return storedValue.maps;
}
