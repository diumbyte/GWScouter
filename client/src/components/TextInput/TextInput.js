import { Component }  from 'react';
import PropTypes from 'prop-types';
import './TextInput.css'

class TextInput extends Component {
    render() {
        const {
            name,
            className,
            value,
            title, 
            titleIcon,
            label, 
            onChange,
            children,
            shouldFocus,
            ...props
        } = this.props; 

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
                <div 
                    className="form-group"
                    style={props.disabled 
                        ? { backgroundColor: "var(--border-dark)", 
                            borderBottom: "4px solid var(--secondary-dark)"
                        } 
                        : {}
                    }
                >
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
                                ref={n => n && shouldFocus && n.focus()}
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
}

TextInput.defaultProps = {
    className: "input-full",
    shouldFocus: false
}

TextInput.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
  }

export default TextInput;