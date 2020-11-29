import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import TextInput from '../../components/TextInput/TextInput';
import './User.css';

class User extends Component {
    constructor() {
        super();

        this.originalState = {
            userId: 0,
            username: '',
            guildName: '',
            guildId: 0,
            isEditingName: false
        }
        this.state = this.originalState;
    }

    componentDidMount = async () => {
        const {data : {id : user_id, username, guild_name, guild_id}} = await axios.get('/auth/user_profile');

        if(!user_id) {
            return this.props.history.push('/Login');
        }

        this.setState({
            userId: user_id, 
            username,
            guildName: guild_name,
            guildId: guild_id
        })
    }

    onChange = (e) => {
        const { target: {value, name}} = e;

        this.setState({
            [name]: value
        })
    }

    onEditName = async () => {
        const { isEditingName, username, user_id, guildId } = this.state;
        
        // Button is displaying "Save" if isEditing is true
        if (isEditingName) {
            await axios.post('/auth/user', {
                guild_id: guildId,
                username
            }) 
            this.props.history.go(0);
        }

        this.setState(prevState => ({
            isEditingName: !prevState.isEditingName
        }))

    }

    onLogout = async () => {
        await axios.get('/auth/logout');
        window.location.href = "/Home";
    }

    onLeaveGuild = async () => {
        await axios.post('/auth/user', {
            guild_id: null,
            username: this.state.username
        });

        this.setState({
            guildId: 0,
            guildName: ''
        });
    }

    render() {
        const { guildName, guildId, username, userId, isEditingName} = this.state;
        
        return (
            <div className="profile-container">
                <div className="heading">
                    <h2>User Profile</h2>
                </div>
                <div className="row">
                    <TextInput
                        title="Guild"
                        name="guildName"
                        value={guildName ? guildName : "None"}
                        className="input-half guild-info"
                        disabled
                        onChange={this.onChange}
                    />
                    {   guildId
                        ?   <div className="input-half">
                                <div className="submit-button guild-button" onClick={this.onLeaveGuild}>
                                    <button>Leave Guild?</button>
                                </div>
                            </div>
                        : <div className="input-half"></div>
                    }

                </div>
                <div className="row">
                    <TextInput
                        title="Username"
                        name="username"
                        value={username}
                        className="input-half user-info"
                        shouldFocus={isEditingName}
                        onChange={this.onChange}
                        disabled={!isEditingName}
                    />
                    <div className="input-half">
                        <div className="submit-button edit-button"  onClick={this.onEditName}>
                            <button>{isEditingName ? "Save Changes" : "Edit Name"}</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div href="/Home" className="submit-button logout-button" onClick={this.onLogout}>
                        <button>Logout</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(User);