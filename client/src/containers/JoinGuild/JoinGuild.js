import { Component } from 'react';
import axios from 'axios';
import './JoinGuild.css';
import TextInput from '../../components/TextInput/TextInput';

class JoinGuild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guildName: '',
        }
    }

    componentDidMount = async () => {
        const { inviteCode } = this.props.match.params;
        const { data : userData } = await axios.get('/auth/user_profile');
        const { data: guildData } = await axios.get(`/api/guild/${inviteCode}`);


        
        // User not logged in
        if(!userData || userData.error || !guildData || guildData.error ) {
            this.props.history.push('/Login');
            return;
        }

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
        
        await axios.post(`/api/guild/join/${inviteCode}`);
        
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
                        <button>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default JoinGuild;