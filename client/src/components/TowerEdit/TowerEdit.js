import { Component } from 'react';
import './TowerEdit.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextInput from '../TextInput/TextInput';
import RadioInput from '../RadioInput/RadioInput';
import PreviousButton from '../../assets/arrow-left-circle.svg';


class TowerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            zone: '',
            isStronghold: false
        }
    }

    componentDidMount = async () => {
        const { towerId } = this.props.match.params;
        let res;
        try {
            res = await axios.get(`/api/tower/${towerId}`);
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }
        const { data } = res;

        this.setState({
            username: data.enemy_username,
            zone: data.zone,
            isStronghold: data.is_stronghold
        })
    }

    onChange = (e) => {
        const { target: {value, name}} = e;
        this.setState(prevState => ({
            [name]: (name === "isStronghold") ? !prevState[name] : value
        }));
    }

    onSubmit = async () => {
        const { towerId } = this.props.match.params;
        const { goBack } = this.props.history;
        try {
            await axios.post(`/api/tower/${towerId}`, this.state);
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }

        goBack();
    }

    onDelete = async () => {
        const { towerId } = this.props.match.params;
        const { goBack } = this.props.history;

        try {
            await axios.delete(`/api/tower/${towerId}`);
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }

        goBack();
    }

    render() {
        const {username, isStronghold, zone} = this.state;
        const { goBack } = this.props.history;
        return (
            <div className="tower-edit-container">
                <div className="row" style={{marginTop: 0}}>
                    <div className="form-title">
                        <img src={PreviousButton} alt="Previos button" className="svg-icon" onClick={goBack}/>
                        <h2>Edit</h2>
                    </div>
                </div>
                <div className="row" style={{marginTop: 0}}>
                    <TextInput 
                        title="Name"
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <div className="row">
                    <RadioInput 
                        title="Zone"
                        type="radio"
                        className="input-full"
                        name="zone"
                        required
                        onChange={this.onChange}
                        checkedState={zone}
                        values={[
                            {value: "top", label: "Top"},
                            {value: "mid", label: "Mid"},
                            {value: "bot", label: "Bot"},
                            {value: "Main", label: "Main"},
                        ]}
                    />
                </div>
                <div className="row">
                    <RadioInput
                        title="Stronghold"
                        type="checkbox"
                        className="input-full"
                        onChange={this.onChange}
                        values={[{
                            value: isStronghold,
                            checked: isStronghold,
                            label: "Is Stronghold?",
                            name: "isStronghold"
                        }]}
                    />
                </div>
                <div className="row tower-buttons">
                    <div className="submit-button delete-button" onClick={this.onDelete}>
                        Delete
                    </div>
                    <div className="submit-button" onClick={this.onSubmit}>
                        Save
                    </div>
                </div>
            </div>
        )
    }
}

export default TowerEdit;