import PropTypes from 'prop-types';

const RadioInput = ({
    name,
    type,
    values,
    className,
    title, 
    label, 
    onChange,
    checkedState,
    unit,
    ...props
}) => {

    const evenPercentage = (Math.round(100 / values.length) * 10) / 10 ;

    // values = [{value: '', label: ''}]
    // name/checked would only be provided with checkbox
    const radioOptions = values.map((opt,idx) => {
        return (
            <div 
                className="form-control" 
                key={idx}
                style={{flex: `1 1 calc(${evenPercentage}% - 1rem)`}}
            >
                <input 
                    type={type} 
                    name={opt.name ? opt.name : name}
                    id={`${unit}-${opt.value}`}
                    value={opt.value}
                    onChange={onChange}
                    checked={opt.checked ? opt.checked : checkedState === opt.value}
                    {...props}
                />
                <label htmlFor={`${unit}-${opt.value}`}>{opt.label}</label>
            </div>
        );
    });

    return (
        <>
        <div className={`${className}`}>                    
            <p className="input-title">{title}</p>
            <div className="form-group">
                <div className="input-label" style={label ? {} : {display: "none"}}>{label}</div>
                <div className="radio-container">
                    {radioOptions}
                </div>
            </div>
        </div>
        </>
    );
}

RadioInput.defaultProps = {
    className: "input-full"
}

// values = [{value: '', label: '', checked: true/false }]
RadioInput.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string,
    className: PropTypes.string,
    checkedState: PropTypes.any,
    onChange: PropTypes.func.isRequired
  }

export default RadioInput;