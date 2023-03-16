import { useState } from 'react';
import './Checkbox.sass';

const Checkbox = ({ children, startChecked, onChange }) => {
    const [ checked, setChecked ] = useState(startChecked);

    return (
        <div className="checkbox">
            <input className="checkbox__input" type="checkbox" checked={checked}></input>
            <label className="checkbox__label" onClick={() => { setChecked(!checked); onChange(!checked) }}>{ children }</label>
        </div>
    );
}

export default Checkbox;