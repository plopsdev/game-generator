import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { firebase } from '../../firebase'
import { login } from '../../store/slices/games';
import Button from '../../components/Button';

const Authentication = () => {
    const dispatch = useDispatch();
    let history = useHistory();

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
              dispatch(login(result.user.uid));
              history.push('/games');
            })
            .catch(e => console.log(e));
        });
    };

    return (
        <div className="container">
            <h1>Yoooo ça va ou quoi ?</h1>
            <Button style={{ marginTop: '1em' }} onClick={() => signInWithGoogle()}>Login avec Google</Button>
        </div>
    );
}

export default Authentication;



