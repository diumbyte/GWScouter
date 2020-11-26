import PropTypes from 'prop-types';
import './TextInput.css'

const TextInput = ({
    name,
    className,
    value,
    title, 
    titleIcon,
    label, 
    onChange,
    children,
    ...props
}) => {
    return (
        <>
        <div className={`${className}`}>                    
            <div className="input-title">
                <p>{title}</p>
                { titleIcon
                    ? titleIcon
                    : <></>
                }
            </div>
            <div className="form-group">
                <label 
                    htmlFor={name} 
                    className="input-label"
                    style={label ? {} : {display: "none"}}
                >
                    {label}
                </label>
                {
                    children
                    ? children
                    : 
                        <input 
                            type="text" 
                            name={name}
                            value={value}
                            onChange={onChange}
                            {...props}
                        />
                }
            </div>
        </div>
        </>
    );
}

TextInput.defaultProps = {
    className: "input-full"
}

TextInput.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
  }

export default TextInput;