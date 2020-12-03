import { Component } from 'react';
import axios from 'axios';
import './JoinGuild.css';

class JoinGuild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guildName: '',
            errorMessage: ''
        }
    }

    componentDidMount = async () => {
        const { inviteCode } = this.props.match.params;
        let userRes, guildRes; 

        try {
            userRes = await axios.get('/auth/user_profile');
            guildRes = await axios.get(`/api/guild/${inviteCode}`);
        } catch(err) {
            const { data, status } = err.response;
            this.setState({errorMessage: `Error ${status}: ${data}`});
            console.log(`Error ${status}: ${data}`)
            return this.props.history.push('/Login');
        }

        const { data : userData } = userRes;
        const { data: guildData } = guildRes;

        const { guildName } = guildData;

        // User already in guild
        if(userData.guild_id) {
            this.props.history.push('/Guild');
            return;
        }

        this.setState({
            guildName
        });
    }

    onJoinGuild = async () => {
        const { inviteCode } = this.props.match.params;
        
        try {
            await axios.post(`/api/guild/join/${inviteCode}`);
        } catch(err) {
            const { data, status } = err.response;
            this.setState({errorMessage: `Error ${status}: ${data}`});
            return;
        }
        
        window.location.href = '/Guild';
    }

    render() {
        const { guildName } = this.state;
        return (
            <div className="join-guild-container">
                <div className="row join-info">
                    <h3>Join {`${guildName}`}?</h3>
                </div>
                <div className="row">
                    <div className="submit-button" onClick={this.onJoinGuild}>
                        Join
                    </div>
                </div>
            </div>
        );
    }
}

export default JoinGuild;