import { Component } from 'react';
import TextInput from '../../components/TextInput/TextInput';
import RadioInput from '../../components/RadioInput/RadioInput';
import './SpeedCalculator.css'

class SpeedCalculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputUserSpeed: 0,
            inputEnemyPercentage: 0,
            outputSpeed: 0, 
            firstTurn: ''
        };
    }

    componentDidMount() {
        this.setState({
            firstTurn: 'self'
        })
    }

    onChange = (e) => {
        const {target: {value, name}} = e;

        this.setState({
            [name]: value,
        });
    }

    calculateSpeed = () => {
        const { firstTurn, inputUserSpeed, inputEnemyPercentage } = this.state;
        const enemyPercentage = inputEnemyPercentage / 100;

        if(Number.isNaN(inputUserSpeed) || Number.isNaN(inputEnemyPercentage)) {
            return 0;
        }

        if(inputUserSpeed <= 0) {
            return 0;
        }

        if(inputEnemyPercentage <= 0 || inputEnemyPercentage > 100) {
            return 0;
        }
        
        let result = 0;
        if (firstTurn === "self") {
            result = Math.round(inputUserSpeed * enemyPercentage);
        } else {
            result = Math.round(inputUserSpeed * (1 + enemyPercentage));
        }
        return result;
    }

    onCalculateClick = () => {
        this.setState({
            outputSpeed: this.calculateSpeed()
        })
    }

    onSubmitClick = () => {
        const { onInputChange, closeModal } = this.props;
        const { outputSpeed } = this.state;

        const psuedoEvent = {
            target: {
                value: outputSpeed,
                name: "speed"
            }
        }
        onInputChange(psuedoEvent);
        closeModal();
    }

    render() {
        const { 
            inputUserSpeed,
            inputEnemyPercentage,
            outputSpeed,
            firstTurn
        } = this.state;
        
        return(
            <div className="speed-calc-container">
                <h2>Speed Calculator</h2>
                <TextInput
                    title="Your Speed"
                    name="inputUserSpeed"
                    value={inputUserSpeed}
                    onChange={this.onChange}
                />
                <TextInput
                    title="Enemy Percentage"
                    label="(1 - 99)"
                    name="inputEnemyPercentage"
                    value={inputEnemyPercentage}
                    onChange={this.onChange}
                />
                <RadioInput 
                    title="First Turn?"
                    type="radio"
                    name="firstTurn"
                    onChange={this.onChange}
                    checkedState={firstTurn}
                    values={[
                        {value: "self", label: "Self"},
                        {value: "enemy", label: "Enemy"},
                    ]}
                />
                <TextInput
                    title="Output Enemy Speed"
                    name="outputSpeed"
                    value={outputSpeed}
                    onChange={this.onChange}
                    disabled
                />
                <div 
                    className="submit-button" 
                    style={{backgroundColor: "#195e83"}}
                    onClick={this.onCalculateClick}
                >
                    <button type="submit">
                        Calculate
                    </button>
                </div>
                <div 
                    className="submit-button"
                    onClick={this.onSubmitClick}
                >
                    <button type="submit">
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default SpeedCalculator;