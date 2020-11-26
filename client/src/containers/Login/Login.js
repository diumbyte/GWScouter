import { Component } from 'react';
import './Login.css';
import DiscordIcon from '../../assets/discord.svg';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginSuccessful: false
        }
    }


    onDiscordLoginClick = () => {
        console.log("Logging in with Discord");
        //TODO: Discord OAuth2 stuff
    }

    render() {
        return (
            <div className="login-container">
                {/* <a className="login-button" href="/auth/discord" onClick={this.onDiscordLoginClick}> */}
                <a className="login-button" href="/auth/discord">
                    <img src={DiscordIcon} className="svg-icon white-svg-icon" alt="Discord Icon"/>
                    <button>Login with Discord</button>
                </a>
            </div>
        );
    }
}

export default Login;