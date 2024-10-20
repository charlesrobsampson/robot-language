import { getPronunciationMap, getConversionMaps } from './getData';
// const en = require('./dictionaries/dictionaries/en.json');
// const toAppend = require('./appendedWords.json');
// // const maps = require('./maps');
// const maps = require('./maps.json');

// const enPronunciations = {
//     ...en,
//     ...toAppend
// };

const diffAvoid = 2;

let enPronunciations;
let maps;

export async function initializeTranslations() {
    enPronunciations = await getPronunciationMap();
    maps = await getConversionMaps();
}

function pronounce(word) {
    let pronunciation = enPronunciations[word.toLowerCase()];
    if (!pronunciation) {
        console.error(`no pronunciation found for word ${word}`);
        return [word];
    }
    return pronunciation;
}

export function sentence(sentence) {
    return sentence.map(pronounce);
}

function toShaw(word, useCompounds = false, useJoiner = false) {
    const joiner = useJoiner ? '*-*': '';
    if (maps.fixedWords[word]) {
        return maps.fixedWords[word] + joiner;
    }
    let shaw = '';
    let p = pronounce(word);
    // console.log('pronunciations', p);
    let pronunciation = p[0];
    let filtered = [];
    if (p.length > 1) {
        let closest = {};
        var rcount = (word.match(/r/g) || []).length;
        if (rcount >= 1) {
            let rdiff = -1;
            // let best = 0;
            // p.forEach((p, i) => {
            p.forEach((p) => {
                let prct = (p.match(/ɹ/g) || []).length;
                let diff = Math.abs(rcount - prct);
                if (rdiff === -1) {
                    rdiff = diff;
                    closest[rdiff] = [p];
                } else {
                    if (diff < rdiff) {
                        rdiff = diff;
                        // best = i;
                        closest[rdiff] = [p];
                    } else if (diff === rdiff) {
                        closest[rdiff].push(p);
                    }
                }
            });
            p = closest[rdiff];
            closest = {};
        }
        // find match with closest number of letters
        let ldiff = -1;
        // let best = 0;
        // p.forEach((p, i) => {
        p.forEach((p) => {
            const plen = p.split(' ').length;
            const wlen = word.length;
            let diff = Math.abs(plen - wlen);
            if (diff < diffAvoid) {
                filtered.push(p);
            }
            if (ldiff === -1) {
                ldiff = diff;
                closest[ldiff] = [p];
            } else {
                if (diff < ldiff) {
                    closest [ldiff] = [p];
                    ldiff = diff;
                    // best = i;
                } else if (diff === ldiff) {
                    if (closest[ldiff]) {
                        closest[ldiff].push(p);
                    } else {
                        closest[ldiff] = [p];
                    }
                }
            }
        });
        // console.log('closest');
        // console.log(closest);
        // console.log('filtered', filtered);
        
        if (filtered.length === 0) {
            const closestDiffs = Object.keys(closest);
            closestDiffs.sort((a, b) => a - b);
            p = closest[closestDiffs[0]];
            // p = closest[ldiff];
            // console.log('we gots not filtered');
            // console.log('ldiff: ', ldiff);
            // console.log('new p');
            // console.log(p);
            
        } else {
            p = filtered;
        }
        // console.log('pronunciations', p);

        // console.log('filtered', filtered);
        pronunciation = p.length > 1? p[1] : p[0];
    }

    // first get compounds
    if (useCompounds) {
        const compounds = Object.keys(maps.compounds);
        compounds.forEach(c => {
            while (pronunciation.indexOf(c) > -1) {
                pronunciation = pronunciation.replace(c, maps.compounds[c]);
            }
        });
    }
    // then get doubles
    const dbls = Object.keys(maps.dbls);
    dbls.forEach(d => {
        while (pronunciation.indexOf(d) > -1) {
            pronunciation = pronunciation.replace(d, maps.dbls[d]);
        }
    });
    // then get single letters
    pronunciation.split(' ').forEach(l => {
        if (maps.sngls[l]) {
            shaw += maps.sngls[l] + joiner;
        } else {
            shaw += l + joiner;
        }
    });
    return shaw;
}

export function toShawSentence(sentence, useCompounds = false, useJoiner = false) {
    const joiner = useJoiner ? ' *-*': ' ';
    return sentence.map(w => toShaw(w, useCompounds, useJoiner)).join(joiner);
}

export function shawToSound(shaw) {
    const n = {
        0: () => '0',
        1: () => {
            const r = Math.random();
            if (r < 0.5) {
                return '7';
            } else {
                return '8';
            }
        },
        2: () => '12',
        3: () => {
            const r = Math.random();
            if (r < 0.5) {
                return '19';
            } else {
                return '20';
            }
        },
    };
    const space = '~';
    const sound = [[],[],[],[]];
    shaw.split('*-*').forEach(s => {
        if (s === ' ') {
            sound.forEach(s => s.push(space));
        } else if (s === '') {
            sound.forEach(s => s.push(space));
            sound.forEach(s => s.push(space));
            sound.forEach(s => s.push(space));
            sound.forEach(s => s.push(space));
        } else {
            let g = maps.shawToGroup[s];
            let pattern = '~';
            if (!g) {
                console.error(`no group found for ${s}`);
                return;
            }
            if (g.group > 2) {
                pattern = `[${g.pattern.split(' ').map(p => `${maps.groups[g.group]}:${p}`).join(' ')}]`;
            } else {
                pattern = `[${g.pattern.split(' ').map(p => {
                    // console.log({p});
                    return n[p]();
                }).join(' ')}]`;
            }
            for (let i = 0; i < sound.length; i++) {
                if (i === g.group) {
                    sound[i].push(pattern);
                } else {
                    sound[i].push(space);
                }
            }
        }
    });
    return sound;
}

export function soundJson(shaw, sound, soundLen = 0.1, startRests = 1, endRests = 1) {
    const output = {
        shaw
    };
    const totalSounds = sound[0].length + startRests + endRests;
    sound.forEach((s, i) => {
        output[`d${i+1}`] = {
            miniNotation: `{ ~ ~,${startRests > 0 ? '~*' + startRests + ' ' : ''}${s.join(' ')}${endRests > 0 ? ' ~*' + endRests : ''}}`,
            sound: maps.groups[i]
        };
    });
    output.duration = soundLen * totalSounds;

    return output;
}

export function forTidal(sound, soundLen = 0.1, repeat = true) {
    const totalSounds = sound[0].length;
    let output = 'do\n';
    output += `  setcps(5)\n  resetCycles\n`;
    let line = '';
    sound.forEach((s, i) => {
        const chan = repeat ? `d${i+1}` : 'once';
        line += `  ${chan} $ n "{ ~ ~, ~ ~ `;
        line += s.join(' ');
        line += `}" # sound ${i<= 2 ? maps.groups[i] : `"${maps.groups[i]}"`}\n`;
        output += line;
        line = '';
    });
    output += `  --hush after ${soundLen * totalSounds} seconds\n\nhush\n`;
    return output;
}

export function enToJson(txt) {
    const shaw = toShawSentence(txt, true, true);
    const sound = shawToSound(shaw);
    return soundJson(toShawSentence(txt, true), sound, .1);
}