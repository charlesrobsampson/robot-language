import { initStrudel } from '@strudel/web';
// import { useState } from 'react';

export default function SoundCard(json, strudel, isTest = false) {
    // const [show, setShow] = useState(false);
    let show = false;
    if (!strudel.strudelInitialized) {
        initStrudel({
            prebake: () => samples('github:tidalcycles/dirt-samples'),
        });
        strudel.setStrudelInitialized(true);
    }
    const play = () => {
        const sounds = {
            smooth: 'sine',
            rough: 'square',
            buzzer: 'sawtooth'
        };
        // const json = {
        //     shaw: '𐑑𐑨𐑒𐑴 𐑑𐑭𐑧𐑥',
        //     d1: {
        //       miniNotation: '{ ~ ~,~*1 ~ [20 12] ~ ~ ~ ~ ~ [12 19] [0 7] ~ ~ ~ ~ ~*1}',
        //       sound: 'smooth'
        //     },
        //     d2: {
        //       miniNotation: '{ ~ ~,~*1 ~ ~ ~ [8 0] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~*1}',
        //       sound: 'rough'
        //     },
        //     d3: {
        //       miniNotation: '{ ~ ~,~*1 [12] ~ [0 8 12] ~ ~ [12] ~ ~ ~ ~ ~ ~ ~ ~*1}',
        //       sound: 'buzzer'
        //     },
        //     d4: {
        //       miniNotation: '{ ~ ~,~*1 ~ ~ ~ ~ ~ ~ [blip:0 blip:0] ~ ~ ~ ~ ~ ~ ~*1}',
        //       sound: 'blip'
        //     },
        //     duration: 1.5
        // };
        console.log(json);

        const oct = 1;
        stack(
            note(m(json.d1.miniNotation).add(12+(12*oct))).s(sounds[json.d1.sound]).decay(.2).sustain(0),// smooth
            note(m(json.d2.miniNotation).add(36+(12*oct))).s(sounds[json.d2.sound]).decay(.2).sustain(0.1),// rough
            note(m(json.d3.miniNotation).add(36+(12*oct))).s(sounds[json.d3.sound]).decay(.3).sustain(0.1),// buzzer
            s(json.d4.miniNotation),
        ).cpm(60 * 10).play();
        setTimeout(() => {
            hush();
        }, (json.duration * 1000) - 100);
    };
    const toggleShow = () => {
        show = !show;
        const showButton = document.getElementById('reveal-button');
        const hideOrShow = document.getElementById('hide-or-show');
        if (show) {
            showButton.innerHTML = 'hide';
            const children = hideOrShow.children;
            for (let i = 0; i < children.length; i++) {
                children[i].classList = [];
            }
        } else {
            showButton.innerHTML = 'reveal';
            const children = hideOrShow.children;
            for (let i = 0; i < children.length; i++) {
                children[i].classList = ['hidden'];
            }
        }
    };
    const reveal = () => {
        if (isTest) {
            // handle test
            return (
                <div className='sound-title'>
                    {/* <button id="reveal-button" onClick={()=>{}}>{show ? 'hide' : 'reveal'}</button> */}
                    <button id="reveal-button" onClick={toggleShow}>{show ? 'hide' : 'reveal'}</button>
                    <div id='hide-or-show'>
                        {json.word ? <h1 className='hidden'>{json.word}</h1> : null}
                        <h1 className='hidden'>{json.shaw}</h1>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='sound-title'>
                    {json.word ? <h1>{json.word}</h1> : null}
                    <h1>{json.shaw}</h1>
                </div>
            )
        }
    }
    return (
        <div key={"sound-card-" + json.shaw} className="sound-card">
            <div className='card-container'>
                {reveal()}
                <button id="play" onClick={play}>hear</button>
            </div>
        </div>
    )
}