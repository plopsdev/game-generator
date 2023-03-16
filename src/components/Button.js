import './Button.sass';

const Button = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className="button"
        >
            { children }
        </button>
    );
}

export default Button;