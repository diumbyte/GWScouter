import { NavLink, Link } from 'react-router-dom';
import './Header.css';
import accountIcon from '../../assets/account.svg';
import guildIcon from '../../assets/shield.svg';
import battleIcon from '../../assets/sword-cross.svg';

const Header = () => {
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
                    <li className="main-nav-item">
                        <NavLink to="/Battle" activeClassName="current-link" >
                            <img className="svg-icon" src={battleIcon} alt="Battle icon"/><span className="main-nav-item-text">Battle</span>
                        </NavLink>
                    </li>
                    <li className="main-nav-item">
                        <NavLink to="/Guild" activeClassName="current-link" >
                            <img className="svg-icon" src={guildIcon} alt="Guild icon"/><span className="main-nav-item-text">Guild</span>
                        </NavLink>
                    </li>
                    <li className="main-nav-item">
                        <NavLink to="/login" activeClassName="current-link" >
                            <img className="svg-icon" src={accountIcon} alt="Account icon"/><span className="main-nav-item-text">Login</span>
                        </NavLink>
                    </li>
                </ul>
            </header>
        </div>
    </nav>
    );
};

export default Header;