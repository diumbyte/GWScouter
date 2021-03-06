import { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import accountIcon from '../../assets/account.svg';
import guildIcon from '../../assets/shield.svg';
import battleIcon from '../../assets/sword-cross.svg';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: false,
            username: '',
            guildId: 0
        }
    }

    componentDidMount = async () => {
        const { data } = await axios.get('/auth/current_user');
        const { username, guild_id : guildId } = data;
        // If the user is not logged in then data is null => returns false
        if(data) {
            this.setState({
                isLoggedIn: true,
                username: username,
                guildId
            })
        }
    }

    renderHeaderItems = () => {
        const { isLoggedIn, username, guildId } = this.state;
        if(isLoggedIn) {
            return (
                <>
                    <li className="main-nav-item">
                        <NavLink to="/Battle" activeClassName="current-link" >
                            <img className="svg-icon" src={battleIcon} alt="Battle icon"/><span className="main-nav-item-text">Battle</span>
                        </NavLink>
                    </li>
                    <li className="main-nav-item">
                        <NavLink to={guildId ? "/Guild" : "/NoGuild"} activeClassName="current-link" >
                            <img className="svg-icon" src={guildIcon} alt="Guild icon"/><span className="main-nav-item-text">Guild</span>
                        </NavLink>
                    </li>
                    <li className="main-nav-item">
                        <NavLink to="/User" activeClassName="current-link" >
                            <img className="svg-icon" src={accountIcon} alt="Account icon"/><span className="main-nav-item-text">{username}</span>
                        </NavLink>
                    </li>
                </>
            );
        } else {
            return (
            <li className="main-nav-item">
                <NavLink to="/Login" activeClassName="current-link" >
                    <img className="svg-icon" src={accountIcon} alt="Account icon"/><span className="main-nav-item-text">Login</span>
                </NavLink>
            </li>
            );
        }
    }

    render() {
        return (
            <nav className="main-nav">
                <div className="container">
                    <header className="main-header">
                        <div className="nav-logo">
                            <Link to="/">
                                <p>GW Scouter</p>
                            </Link>
                        </div>
                        <ul className="main-nav-list">
                            {this.renderHeaderItems()}
                        </ul>
                    </header>
                </div>
            </nav>
            );
    }
}

export default Header;