import { Component } from 'react';
import TextInput from '../../components/TextInput/TextInput';
import axios from 'axios';
import { toast } from 'react-toastify';

export default class GuildEdit extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            guildName: ''
        };
    }

    componentDidMount = async () => {
        const { guildName } = this.props;

        this.setState({
            guildName
        })
    }

    onChange = (e) => {
        const { target: {value, name}} = e;
        this.setState({
            [name]: value
        });
    }

    onSubmit = async () => {
        const { guildId, onCloseModal, onGuildEdit } = this.props;

        try {
            await axios.post(`/api/guild/${guildId}`, this.state);
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }

        onGuildEdit(this.state.guildName);
        onCloseModal();
    }

    render() {
        const { guildName } = this.state;

        return (
            <div className="guild-edit-container">
                <div className="row">
                    <TextInput 
                        title="Guild Name"
                        name="guildName"
                        value={guildName}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <div className="row">
                    <div className="submit-button" onClick={this.onSubmit}>
                        Save
                    </div>
                </div>
            </div>
        );
    }
}