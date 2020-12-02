import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Collapsible from 'react-collapsible';
import PreviousButton from '../../assets/arrow-left-circle.svg';
import TextInput from '../../components/TextInput/TextInput';
import RadioInput from '../../components/RadioInput/RadioInput';
import AutosuggestInput from '../AutosuggestInput/AutosuggestInput';
import SpeedCalculator from '../SpeedCalculator/SpeedCalculator';
import CalculatorIcon from '../../assets/calculator.svg'
import './TowerForm.css'
import './Collapsible.css'
import axios from 'axios';
class TowerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            username: '',
            zone: '',
            unitA: {
                unitId: 0,
                team: 'teamOne',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            unitB: {
                unitId: 0,
                team: 'teamOne',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            unitC: {
                unitId: 0,
                team: 'teamOne',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            unitD: {
                unitId: 0,
                team: 'teamTwo',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            unitE: {
                unitId: 0,
                team: 'teamTwo',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            unitF: {
                unitId: 0,
                team: 'teamTwo',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            heroList: [],
            artifactList: [],
            openModal: false,
            activeUnit: ''
        }
    }

    componentDidMount = async () => {
        // TODO: Do API GET request for full hero+artifact lists here
        let resHeroes, resArtifacts;
        try {
            resHeroes = await axios.get('/api/hero');
            resArtifacts = await axios.get('/api/artifact');
        } catch(err) {
            const { data, status } = err.response;
            this.setState({errorMessage: `Error ${status}: ${data}`});
            return;
        }

        const { data : heroData} = resHeroes;
        const { data : artifactData} = resArtifacts;
        
        this.setState(prevState => ({
            ...prevState,
            heroList: heroData,
            artifactList: artifactData
            }));
    }

    //********** Form boilerplate **********/
    onInputChange = (unit) => (event) => {
        const {target: {name, value} } = event;

        if(unit === undefined) {
            this.setState(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            this.setState(prevState => ({
                ...prevState,
                [unit]: {
                    ...prevState[unit],
                    [name]: (name === "hasCounter" || name === "hasImmunity") ? !prevState[unit][name] : value
                }
            }));
        }

    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        // TODO: API PUT code and stuff
        // TODO: Uncomment below when finished.
        // const { goBack } = this.props.history;
        // goBack();
    }

        // units = ["unitA", "unitB", "unitC"]
    teamFormBuilder = (units) => {
        return ( 
            units.map(unit => {
                return (
                <div className="form-unit-container" key={unit}>
                    <AutosuggestInput
                        id={`${unit}-name`}
                        title="Name"
                        name="name"
                        suggestionValue="id"
                        value={this.state[unit].name}
                        className="input-full"
                        onChange={this.onInputChange(unit)}
                        optionsList={this.state.heroList}
                        searchKeys={["name", "alias"]}
                        required
                    />
                    <TextInput 
                        title="Speed"
                        name="speed"
                        value={this.state[unit].speed}
                        className="input-full"
                        onChange={this.onInputChange(unit)}  
                        titleIcon={<img 
                            src={CalculatorIcon} 
                            className="svg-icon" 
                            onClick={() => this.onOpenModal(unit)} 
                            alt="Speed calculator icon"
                            />}
                    />
                    <TextInput 
                        title="Health"
                        name="health"
                        value={this.state[unit].health}
                        className="input-full"
                        onChange={this.onInputChange(unit)}  
                    />
                    <AutosuggestInput 
                        id={`${unit}-artifact`}
                        title="Artifact"
                        name="artifact"
                        value={this.state[unit].artifact}
                        className="input-full"
                        onChange={this.onInputChange(unit)}
                        searchKeys={["name", "alias"]}
                        optionsList={this.state.artifactList}
                        suggestionValue="id"
                    />
                    <RadioInput 
                        title="Gear Sets"
                        type="checkbox"
                        className="input-full"
                        label="Check all that apply"
                        onChange={this.onInputChange(unit)}
                        unit={unit}
                        values={[
                            {
                                value: "hasImmunity", 
                                name: "hasImmunity", 
                                label: "Immunity?",
                                checked: this.state[unit].hasImmunity
                            },
                            {
                                value: "hasCounter", 
                                name: "hasCounter", 
                                label: "Counter?",
                                checked: this.state[unit].hasCounter
                            }
                        ]}
                    />
                </div>
                );
            })
        );
    };

    onOpenModal = (unit) => {this.setState({openModal: true, activeUnit: unit})}
    onCloseModal = () => {this.setState({openModal: false, activeUnit: ''})}


    render() {
        const { goBack } = this.props.history;
        const { username, zone, openModal, activeUnit } = this.state;

        return (
            <>
            <div className="form-title">
                <img src={PreviousButton} alt="Previous button" className="svg-icon" onClick={goBack}/>
                <h2>Add New Tower</h2>
            </div>
            <form className="tower-form-container" onSubmit={this.handleFormSubmit}>
                <div className="tower-info">
                    <TextInput 
                        title="Username"
                        name="username"
                        value={username}
                        className=""
                        onChange={this.onInputChange()}  
                    />
                    <RadioInput 
                        title="Zone"
                        type="radio"
                        className=""
                        name="zone"
                        onChange={this.onInputChange()}
                        checkedState={zone}
                        values={[
                            {value: "top", label: "Top"},
                            {value: "mid", label: "Mid"},
                            {value: "bot", label: "Bot"},
                            {value: "Main", label: "Main"},
                        ]}
                    />
                </div>
                <Collapsible trigger="Team One" transitionTime={250} open={true} className="input-full" openedClassName="input-full">
                    <div className="form-team-container">
                        {this.teamFormBuilder(["unitA", "unitB", "unitC"])}
                    </div>
                </Collapsible>
                <Collapsible trigger="Team Two" transitionTime={250} className="input-full" openedClassName="input-full">
                    <div className="form-team-container">
                        {this.teamFormBuilder(["unitD", "unitE", "unitF"])}
                    </div>
                </Collapsible>
                <Modal open={openModal} onClose={this.onCloseModal} classNames={{modal: 'customModal'}}>
                    <SpeedCalculator
                        onInputChange={this.onInputChange(activeUnit)}
                        closeModal={this.onCloseModal}
                    />
                </Modal>
                <div className="submit-button">
                    <button type="submit" id="submit">Save</button>
                </div>
                {/* <input type="button" id="submit" value="Save" onClick={this.handleFormSubmit} /> */}
            </form>
            </>
        );
    }
}

export default withRouter(TowerForm);