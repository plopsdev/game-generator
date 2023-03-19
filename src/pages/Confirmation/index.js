import React from 'react';
import { useHistory } from 'react-router-dom';

import '../Confirmation/confirmation.sass'
import Button from '../../components/Button';

const Confirmation = () => {
    const history = useHistory();

    return (
        <div className="confirmation">
            <div>
                <h1>MERCI A TOI MON AMI</h1>
                <Button onClick={() => history.push('/games')}>Retourner dans la liste des jeux</Button>
            </div>
        </div>
    );
}

export default Confirmation;