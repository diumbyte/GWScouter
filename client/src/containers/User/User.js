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
            isEditingName: false,
            errorMessage: ''
        }
        this.state = this.originalState;
    }

    componentDidMount = async () => {
        let res;
        try {   
            res = await axios.get('/auth/user_profile');
        } catch(err) {
            return this.props.history.push('/Login');
        }
        const {data : {id : user_id, username, guild_name, guild_id}} = res;

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
        const { isEditingName, username, guildId } = this.state;
        
        // Button is displaying "Save" if isEditing is true
        if (isEditingName) {
            try {
                await axios.post('/auth/user', {
                    guild_id: guildId,
                    username
                });
            } catch(err) {
                const { data, status } = err.response;
                this.setState({errorMessage: `Error ${status}: ${data}`});
                return;
            }
            this.props.history.go(0);
        }

        this.setState(prevState => ({
            isEditingName: !prevState.isEditingName
        }))

    }

    onLogout = async () => {
        try {
            await axios.get('/auth/logout');
        } catch(err) {
            const { data, status } = err.response;
            this.setState({errorMessage: `Error ${status}: ${data}`});
            return;
        }
        window.location.href = "/Home";
    }

    onLeaveGuild = async () => {
        try {
            await axios.post('/auth/user', {
                guild_id: null,
                username: this.state.username
            });
        } catch(err) {
            const { data, status } = err.response;
            this.setState({errorMessage: `Error ${status}: ${data}`});
            return;
        }

        this.setState({
            guildId: 0,
            guildName: ''
        });
        this.props.history.go(0);
    }

    render() {
        const { guildName, guildId, username, isEditingName} = this.state;
        
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
                                <input 
                                    type="submit"
                                    className="submit-button guild-button" 
                                    onClick={this.onLeaveGuild}
                                    value="Leave Guild"
                                >
                                </input>
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
                        <input 
                            className="submit-button edit-button" 
                            type="submit" 
                            onClick={this.onEditName}
                            value={isEditingName ? "Save Changes" : "Edit Name"}
                        />
                    </div>
                </div>
                <div className="row">
                    <div href="/Home" className="submit-button logout-button" onClick={this.onLogout}>
                        Logout
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(User);