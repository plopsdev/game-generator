import './Button.sass';

const Button = ({ children, disabled, ...props }) => {
    return (
        <button
            {...props}
            className={disabled ? 'button disabled' : 'button'}
            disabled={disabled}
        >
            { children }
        </button>
    );
}

export default Button;