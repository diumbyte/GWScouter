import { withRouter } from 'react-router-dom';
import './LoginPage.css';
import DiscordIcon from '../../assets/discord.svg';

const Login = () => {
    return (
        <div className="login-container">
            <a className="login-button" href="/auth/discord">
                <img src={DiscordIcon} className="svg-icon white-svg-icon" alt="Discord Icon"/>
                <button>Login with Discord</button>
            </a>
        </div>
    );
}

export default withRouter(Login);