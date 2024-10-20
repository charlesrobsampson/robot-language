import SoundCard from './SoundCard';
import { shawToSound, soundJson, toShawSentence } from '../translate';
import Navbar from './Navbar';
import { readNav } from '../nav';
import { useState } from 'react';

const defaultNav = {
    0: 'learn',
    'test:0': 'letters'
};

export default function Test(configs, strudel) {
    const maps = configs.maps;
    const [nav, setNav] = useState(readNav() || defaultNav);
    const [word, setWord] = useState();
    const [letter, setLetter] = useState();
    const [wordCount, setWordCount] = useState('');


    const renderLetter = () => {
        if (letter) {
            const shawSound = shawToSound(letter);
            return SoundCard(soundJson(letter, shawSound), strudel, true)
            // return (letters.map(l => {
            // }))
        }
    };
    const renderWord = () => {
        if (word) {
            const shaw = toShawSentence([word], true, true);
            const sound = shawToSound(shaw);
            const json = soundJson(toShawSentence([word], true), sound, .1)
            return SoundCard({
                ...json,
                word,
            }, strudel, true);
        }
    };
    const getWord = () => {
        if (configs.topWords) {
            const listLength = parseInt(wordCount);
            const wordlist = configs.topWords.slice(0, listLength);
            const wordIndex = Math.floor(Math.random() * listLength);
            const newWord = wordlist[wordIndex];
            setWord(newWord);
        }
    };
    const getLetter = () => {
        setWordCount('0');
        const shawGroups = maps?.shawToGroup;
        if (shawGroups) {
            const letters = Object.keys(shawGroups);
            const listLength = letters.length;
            const letterIndex = Math.floor(Math.random() * listLength);
            const newLetter = letters[letterIndex];
            setLetter(newLetter);
        }
    };
    const renderOption = () => {
        if (nav['test:0'] === 'letters') {
            return renderLetter();
        }
        else if (nav['test:0'] === 'words') {
            return renderWord();
        }
    }
    const handleChange = (event) => {
        const inputValue = event.target.value;

        // Use a regular expression to filter out non-numeric characters
        const numericValue = inputValue.replace(/[^0-9]/g, '');


        setWordCount(numericValue);
    };
    return (
        <div className='card-section'>
            <div className="cards">
                {Navbar('test:0', nav, setNav, ['letters', 'words'])}
                {nav['test:0'] === 'words'
                    ? <div className='wordlist-length'>
                        <h3 className='wordlist-label'>word list length (up to 10,000)</h3>
                        <input
                            type="text"
                            value={wordCount}
                            onChange={handleChange}
                        />
                    </div>
                    : null
                }
                {renderOption()}
            </div>
            {nav['test:0'] === 'words'
                ? <div className='buttons'>
                    <button id="new-word" onClick={getWord}>new word</button>
                </div>
                : <div className='buttons'>
                    <button id="new-letter" onClick={getLetter}>new letter</button>
                </div>
            }

        </div>
    );
}