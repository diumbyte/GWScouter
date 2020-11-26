import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import ArtifactData from '../../assets/SampleData/ArtifactData';
import PreviousButton from '../../assets/arrow-left-circle.svg';
import TextInput from '../../components/TextInput/TextInput';
import RadioInput from '../../components/RadioInput/RadioInput';
import AutosuggestInput from '../AutosuggestInput/AutosuggestInput';
import SpeedCalculator from '../SpeedCalculator/SpeedCalculator';
import CalculatorIcon from '../../assets/calculator.svg'
import './UnitForm.css'

// TODO: Possibly add unit character image to the background of the title? Similar to inspo
class UnitForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            unitData: {
                unitId: 0,
                team: '',
                name: '',
                speed: 0,
                health: 0,
                artifact: '',
                hasImmunity: false,
                hasCounter: false
            },
            artifactList: [],
            openModal: false
        }
    }

    componentDidMount() {
        // TODO: Do API GET request for specific unit here
        this.setState({
            username: 'userOne',
            artifactList: ArtifactData,
            unitData: {
                unitId: 0,
                unitCode: 'c2007',
                team: 'teamOne',
                name: 'Arbiter Vildred',
                speed: 215,
                artifact: 'Moonlight Dreamblade',
                health: 11000,
                hasImmunity: true,
                hasCounter: false
            }
        });
    }

    //********** Form boilerplate **********/
    onInputChange = (event) => {
        const {target: {value, name} } = event;

        this.setState(prevState => ({
            ...prevState,
            unitData: {
                ...prevState.unitData,
                [name]: (name === "hasCounter" || name === "hasImmunity") ? !prevState.unitData[name] : value
            }
        }));
    }

    handleFormSubmit = (e) => {
        // e.preventDefault();
        console.log(this.state);
        // TODO: API PUT code and stuff
        // TODO: Uncomment below when finished.
        // const { goBack } = this.props.history;
        // goBack();
    }

    onOpenModal = () => {this.setState({openModal: true})}
    onCloseModal = () => {this.setState({openModal: false})}

    render() {
        const {unitData, username, openModal } = this.state;
        const { goBack } = this.props.history;
        
        return (
            <>
                <div className="form-title">
                    <img src={PreviousButton} alt="Previous button" className="svg-icon" onClick={goBack}/>
                    <h2>Editing Unit</h2>
                </div>
                <div className="form-subtitle">
                    <p>Tower: {username}</p>
                </div>

                <form className="form-container">
                    <div className="input-half inputs-container">
                        <TextInput 
                            title="Name"
                            name="name"
                            value={unitData.name}
                            className="input-full"
                            onChange={this.onInputChange}  
                        />
                        <TextInput 
                            title="Speed"
                            name="speed"
                            value={unitData.speed}
                            className="input-full"
                            onChange={this.onInputChange}  
                            titleIcon={<img src={CalculatorIcon} className="svg-icon" onClick={this.onOpenModal} alt="Speed calculator icon"/>}
                        />
                        <TextInput 
                            title="Health"
                            name="health"
                            value={unitData.health}
                            className="input-full"
                            onChange={this.onInputChange}  
                        />
                        <AutosuggestInput 
                            title="Artifact"
                            name="artifact"
                            value={unitData.artifact}
                            className="input-full"
                            onChange={this.onInputChange}
                            optionsList={ArtifactData}
                            searchKeys={["name", "alias"]}
                        />
                        <RadioInput 
                            title="Gear Sets"
                            type="checkbox"
                            className="input-full"
                            label="Check all that apply"
                            onChange={this.onInputChange}
                            values={[
                                {
                                    value: "hasImmunity", 
                                    name: "hasImmunity", 
                                    label: "Immunity?",
                                    checked: unitData.hasImmunity
                                },
                                {
                                    value: "hasCounter", 
                                    name: "hasCounter", 
                                    label: "Counter?",
                                    checked: unitData.hasCounter
                                }
                            ]}
                        />
                    </div>
                    <div className="input-half unit-image-preview">
                            <img 
                                src={`${process.env.PUBLIC_URL}/assets/images/hero/${unitData.unitCode}.png`}
                                alt=""
                            />
                    </div>
                    <div className="submit-button" onClick={this.handleFormSubmit}>
                        <button type="submit">Save</button>
                    </div>
                </form>
                <Modal open={openModal} onClose={this.onCloseModal} classNames={{modal: 'customModal'}}>
                    <SpeedCalculator
                        onInputChange={this.onInputChange}
                        closeModal={this.onCloseModal}
                    />
                </Modal>
            </>
        );
    }
}

export default withRouter(UnitForm);