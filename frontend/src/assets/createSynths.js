import { Synth } from '@strudel/web';

export const mySynth = new Synth({
    // Oscillators
    oscillators: [
        {
            type: 'sine',
            frequency: 200,
            amplitude: 0.5,
            detune: -12, // detune by 1 semitone
            noise: 0.2 // add some random noise
        },
        {
            type: 'square',
            frequency: 300,
            amplitude: 0.3,
            phase: Math.PI / 4 // phase shift the square wave
        }
    ],

    // Filters
    filters: [
        {
            type: 'lowpass',
            cutoff: 100,
            resonance: 0.5,
            gain: 2 // apply a gain boost before filtering
        },
        {
            type: 'highpass',
            cutoff: 500,
            gain: -1 // apply a gain reduction after filtering
        }
    ],

    // Amplifier
    amplifier: {
        gain: 4 // overall gain of the synth
    },

    // Envelope
    envelope: {
        attack: 0.01, // time to reach maximum amplitude (seconds)
        decay: 0.5, // time to decay to half amplitude (seconds)
        sustain: 1, // time to maintain maximum amplitude (seconds)
        release: 2, // time to decay to zero amplitude (seconds)
    }
});