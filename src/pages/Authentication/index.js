import React from 'react'
import {firebase} from '../../firebase'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/games';
import '../Games/games.sass';
import Button from '../../components/Button';

const Authentication = () => {
    const dispatch = useDispatch()
    let history = useHistory()

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => { 
          firebase
          .auth()
          .signInWithPopup(provider)
          .then(result => {
            dispatch(login(result.user.uid))
            history.push("/games")
          })
          .catch(e => console.log(e))
        })
      }

    return(
        <div className="container">
            <h1>Yoooo ça va ou quoi ?</h1>
            <Button onClick={() => signInWithGoogle()}>Login avec Google</Button>
        </div>
    )
}

export default Authentication



