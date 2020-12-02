import { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Fuse from 'fuse.js';
import './Autosuggestion.css';

class AutosuggestInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: []
        }
    }

    //********** Autocomplete boilerplate **********/
    onAutocompleteChange = (event, { newValue, method }) => {
        const { onChange } = this.props;

        const pseduoEvent = {
            target: {
                value: newValue, 
                name: this.props.name
            }
        }
        onChange(pseduoEvent);
    }

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const { optionsList } = this.props;
        
        const fuseOpts = {
            threshold: 0.3,
            keys: this.props.searchKeys
        }
        const fuse = new Fuse(optionsList, fuseOpts);
        const results = fuse.search(value).map(sugg => sugg.item);

        return inputLength === 0
            ? []
            : results
    }

    getSuggestionValue = suggestion => {
        const {suggestionValue} = this.props;
        return suggestionValue ? suggestionValue : suggestion.name;
    }

    renderSuggestion = suggestion => (
        <div>
        { this.props.suggestionProp
            ? suggestion[this.props.suggestionProp]
            : suggestion.name
        }
        </div>
    );

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        })
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    };

    renderInputComponent = (inputProps) => {
        const { label, ...otherProps } = inputProps;

        return (
            <>
                { label 
                    ? <label htmlFor="" className="input-label">{label}</label>
                    : <></>
                }
                <input type="text" {...otherProps} />
            </>
        )
    }
    
    render() {
        const { 
            title ,
            label,
            value,
            className,
            placeholder,
            id,
            onSuggestionSelected,
            required
        } = this.props;

        const { suggestions } = this.state;

        const inputProps = {
            placeholder,
            value,
            label,
            onChange: this.onAutocompleteChange,
            required
        }
        
        return (
            <div className={`${className}`}>
                {   title
                    ? <p className="input-title">{title}</p>
                    : <></>
                }
                <Autosuggest 
                    id={id}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    renderInputComponent={this.renderInputComponent}
                    inputProps={inputProps}
                    onSuggestionSelected={onSuggestionSelected}
                />
            </div>
        );
    }
}

export default AutosuggestInput;