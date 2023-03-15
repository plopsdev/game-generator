import React from 'react';
import '../styles/games.sass';
import { useHistory } from "react-router-dom";
import '../styles/confirmation.sass'

const Confirmation = () => {
    let history = useHistory()
    return(
        <div className="confirmation">
            <div>
                <h1>MERCI A TOI MON AMI</h1>
                <button onClick={() => history.push("/games")}>Retourner dans la liste des jeux</button>
            </div>
        </div>
    )
}

export default Confirmation