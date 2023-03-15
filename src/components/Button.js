import './Button.sass';

const Button = ({ children, secondary, ...props }) => {
    return (
        <button
            {...props}
            className="button"
            style={{ backgroundColor: secondary ? 'lightgray' : 'white' }}
        >
            { children }
        </button>
    );
}

export default Button;