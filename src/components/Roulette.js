import React, {useState, useEffect, useCallback, useMemo} from 'react';
import { antoine_souleve_damien, baffes, boite_de_nuit, damien_danse, dorian_pompes, do_claques, ecademy, jojomi_danse, jojo_danse, jojo_detergeant, jojo_ordi, mich_content, mich_danse, mich_dodo, mojito, zoe } from '../static';
import { useHistory } from "react-router-dom";

import '../styles/generator.css' 
const animations = [antoine_souleve_damien, baffes, boite_de_nuit, damien_danse, do_claques, dorian_pompes, jojo_danse, jojo_detergeant, jojo_ordi, jojomi_danse, mich_content, mich_danse, mich_dodo, mojito, zoe, ecademy]
const songs = [
    'https://media1.vocaroo.com/mp3/1maiZIj3u1f9',
    'https://media1.vocaroo.com/mp3/1iqXY0PHc422',
    'https://media1.vocaroo.com/mp3/19lmPL3j54zf',
    'https://media1.vocaroo.com/mp3/12bzJgNgor52',
    'https://media1.vocaroo.com/mp3/1fJvqWQvsM7L',
    'https://media1.vocaroo.com/mp3/15eJjBhnlIy1',
    'https://media1.vocaroo.com/mp3/1j8MDKcvFidQ',
    'https://media1.vocaroo.com/mp3/1hixyEOdqUHR',
    'https://media1.vocaroo.com/mp3/1cgnZbnj7MuU',
    'https://media1.vocaroo.com/mp3/1jpq3QKW2S66',
    'https://media1.vocaroo.com/mp3/1dzAP9WgKpoG',
    'https://media1.vocaroo.com/mp3/1opi2mi1oKe3',
    'https://media1.vocaroo.com/mp3/16TXWiGZdnKj',
    'https://media1.vocaroo.com/mp3/1nsqwUk1qAPt',
    'https://media1.vocaroo.com/mp3/17O6SFjaL2KC'
]


const Roulette = ({ randomGame, gamesWithProbability, setGenerate }) => {
    const songsUrl = useMemo(() => {
        return songs[Math.floor(Math.random()*songs.length)]
    }, [songs])
    const audio = useMemo(() => {
        return new Audio(songsUrl);
    }, [songsUrl]);
    
    let history = useHistory()

    const [gameRoulette, setGameRoulette] = useState({})
    const [isRouletteDone, setRouletteDone] = useState(false)
    
    const rouletteFunction = (x) => {
        return (Math.pow(x, 2))/100 + 20
    }  

    const startRoulette = useCallback((generatedGameIndex, counter, timeout) => {
        
        setGameRoulette(gamesWithProbability[(counter - 1) % gamesWithProbability.length]);
        if(counter === Math.floor(gamesWithProbability.length * 3 / gamesWithProbability.length * 35)) {
            generatedGameIndex = gamesWithProbability.findIndex(game => game.name === randomGame.name);
        }
        if((counter - 1) % gamesWithProbability.length === generatedGameIndex) {
            clearTimeout(timeout);
            setRouletteDone(true)
            return;
        }
        counter++;
        clearTimeout(timeout);
        setTimeout(() => startRoulette(generatedGameIndex, counter, timeout), rouletteFunction(counter));
    }, []);

    const animationUrl = useMemo(() => {
        return animations[Math.floor(Math.random()*animations.length)];
    }, [animations]);
    
    useEffect(() => {
        audio.play();
        let counter = 1;
        let generatedGameIndex = -1;
        let timeout;       
        timeout = setTimeout(() => startRoulette(generatedGameIndex, counter, timeout), rouletteFunction(counter));
    }, []);

    return (
        <div style={{
            backgroundImage: `url(${animationUrl})`,
            backgroundColor: 'white',
            height: "100%",
            width: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: 'fixed',
            padding: 0,
            margin: 0,
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            // background: 'red'
        }}>
            <div style={{
                position: 'relative',
                height: '25vh'
            }}>
                <img src={gameRoulette.picture}/>
                { isRouletteDone && (
                    <div style={{ position: 'absolute', display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <button onClick={() => { setGenerate(false); audio.pause() }}>RETOUR A LA ROULETTE</button>
                    </div>
                )}
            </div>
        </div>
        
    )
}

export default Roulette