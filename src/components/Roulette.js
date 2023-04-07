import React, { useState, useEffect, useMemo } from 'react';
import { antoine_souleve_damien, baffes, boite_de_nuit, damien_danse, dorian_pompes, do_claques, ecademy, jojomi_danse, jojo_danse, jojo_detergeant, jojo_ordi, mich_content, mich_danse, mich_dodo, mojito, zoe } from '../assets/gifs';

import './Roulette.sass';
import Button from './Button';
import { getRandomInteger } from '../utils/numbers';
import RiggedGames from '../enums/RiggedGames';
import { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o } from '../assets/audio';

const animations = [
    antoine_souleve_damien, baffes, boite_de_nuit, damien_danse, do_claques, dorian_pompes, jojo_danse, jojo_detergeant, jojo_ordi, jojomi_danse, mich_content, mich_danse, mich_dodo, mojito, zoe, ecademy
];

const songs = [ a, b, c, d, e, f, g, h, i, j, k, l, m, n, o ];

const Roulette = ({ randomGame, gamesWithProbability, generate, setGenerated }) => {
    const [ state, setState ] = useState({
        shownGameIndex: 0,
        spins: 0,
    });

    const target = useMemo(() => ({
        shownGameIndex: gamesWithProbability.findIndex(game => game.name === randomGame.name),
        spins: Math.round(getRandomInteger(2, 4) * 25 / gamesWithProbability.length),
    }), [ getRandomInteger, randomGame ]);
    
    const audio = useMemo(() => {
        const songsUrl = songs[Math.floor(Math.random() * songs.length)];
        return new Audio(songsUrl);
    }, [ songs, randomGame ]);

    const animationUrl = useMemo(() => {
        return animations[Math.floor(Math.random() * animations.length)];
    }, [ animations, randomGame ]);


    const getTimeUntilNextGame = () => {
        const x = (state.shownGameIndex + 1) + state.spins * gamesWithProbability.length;
        return Math.pow(x, 2) / 100 + 20;
    };

    const targetReached = target.spins === state.spins && target.shownGameIndex === state.shownGameIndex;

    useEffect(() => {
        setState(state => ({ shownGameIndex: state.shownGameIndex, spins: 0 }));
    }, [ randomGame ]);

    useEffect(() => {
        if (targetReached) return;
        setTimeout(() => setState(state => {
            const index = (state.shownGameIndex + 1) % gamesWithProbability.length;
            return {
                shownGameIndex: index,
                spins: index === 0 ? state.spins + 1 : state.spins,
            }
        }), getTimeUntilNextGame());
    }, [ state.shownGameIndex, state.spins ]);
    
    useEffect(() => {
        if (!audio) return;
        audio.play();
    }, [ audio ]);
    
    const shownPicture = !targetReached && gamesWithProbability[state.shownGameIndex].id === RiggedGames.PRINCES
        ? gamesWithProbability[getRandomInteger(0, gamesWithProbability.length - 1)].picture
        : gamesWithProbability[state.shownGameIndex].picture;

    return (
        <div className="roulette" style={{ backgroundImage: `url(${animationUrl})` }} onContextMenu={event => event.preventDefault()}>
            <div className="roulette__content">
                <img src={shownPicture}/>
                { targetReached && (
                    <div className="roulette__buttons">
                        <Button onClick={() => { setGenerated(false); audio.pause() }}>
                            RETOUR À LA ROULETTE
                        </Button>
                        <Button onMouseDown={event => { audio.pause(); generate(event) }}>
                            Générer !
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Roulette;