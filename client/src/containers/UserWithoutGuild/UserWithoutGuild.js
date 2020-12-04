import { Component } from 'react';
import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import 'react-responsive-modal/styles.css';
import TextInput from '../../components/TextInput/TextInput'
import AddIcon from '../../assets/plus-circle.svg';
import './UserWithoutGuild.css';
import axios from 'axios';

class UserWithoutGuild extends Component {
    constructor() {
        super();
        this.state = {
            openModal: false,
            guildName: ''
        }
    }

    onOpenModal = () => {this.setState({openModal: true})}
    onCloseModal = () => {this.setState({openModal: false})}
    onInputChange = (e) => {this.setState({guildName: e.target.value})}

    handleFormSubmit = async (e) => {
        e.preventDefault();
        const { guildName } = this.state;
        
        try {
            await axios.post('/api/guild/new', {
                guildName
            })
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }
        
        this.onCloseModal();
        window.location.href = "/Guild";
    }

    render() {
        const { openModal } = this.state;
        return (
            <div className="no-guild-container">
                <div className="content-container">
                    <div className="create-guild-container">
                        <img src={AddIcon} className="svg-icon" alt="Create guild" onClick={this.onOpenModal}/>
                        <h3>Create Guild</h3>
                    </div>
                    <h3 className="or-block">Or</h3>
                    <h3>Receive an invite link to join a guild</h3>
                </div>
                <Modal open={openModal} onClose={this.onCloseModal} classNames={{modal: 'customModal'}}>
                    <form action="">
                        <TextInput 
                            title="Guild Name"
                            name="guildName"
                            value={this.state.guildName}
                            className="input-half speedValueField"
                            onChange={this.onInputChange}  
                        />
                        <div className="submit-button" onClick={this.handleFormSubmit}>
                            Save
                        </div>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default UserWithoutGuild;

