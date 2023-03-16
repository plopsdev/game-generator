import './Checkbox.sass';

const Checkbox = ({ children, checked, onClick }) => {
    return (
        <div className="checkbox">
            <input className="checkbox__input" type="checkbox" checked={checked}></input>
            <label className="checkbox__label" onClick={onClick}>{ children }</label>
        </div>
    );
}

export default Checkbox;