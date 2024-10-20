import './App.css'
import Navbar from './assets/components/Navbar';
import { readNav } from './assets/nav';
import { getTopWords, getPronunciationMap, getConversionMaps } from './assets/getData';
import { initStrudel } from '@strudel/web';
import { useState, useEffect } from 'react';
import { initializeTranslations } from './assets/translate';
import Learn from './assets/components/Learn';
import Test from './assets/components/Test';

const defaultNav = {
  0: 'learn'
};

function App() {
  const [topWords, setTopWords] = useState(null);
  const [enPronunciation, setEnPronunciation] = useState(null);
  const [maps, setMaps] = useState(null);
  const [strudelInitialized, setStrudelInitialized] = useState(false);
  const [nav, setNav] = useState(readNav() || defaultNav);

  initializeTranslations();

  useEffect(() => {
    getTopWords().then(rsp => {
      setTopWords(rsp);
    });
    getPronunciationMap().then(rsp => {
      setEnPronunciation(rsp);
    });
    getConversionMaps().then(rsp => {
      setMaps(rsp);
    });
  }, []);

  const init = () => {
    initStrudel({
      prebake: () => samples('github:tidalcycles/dirt-samples'),
    });
  };

  const displaySelected = () => {
    if (nav['0'] === 'learn') {
      return Learn({maps, topWords, enPronunciation}, { strudelInitialized, setStrudelInitialized });
    } else if (nav['0'] === 'test') {
      return Test({maps, topWords, enPronunciation}, { strudelInitialized, setStrudelInitialized });
    }
  }
  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {/* <h1></h1> */}
      <button id="load-samples" onClick={init}>load sounds</button>
      <br></br>
      {Navbar(0, nav, setNav, ['learn', 'test'])}
      {displaySelected()}
      <p className="read-the-docs">
        <a href='https://d6pkn0bf1koi5.cloudfront.net' target="_blank">
          brush up on some Shavian
        </a>
      </p>
    </>
  )
}

export default App
