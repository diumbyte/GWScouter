import {
    NavLink,
    useRouteMatch
} from 'react-router-dom';

import './TowersNav.css';

const TowersNav = (props) => {

    const { url } = useRouteMatch();

    return (
        <nav className="container stronghold-nav">
            <ul className="stronghold-nav-list">
                <li className="stronghold-nav-item">
                    <NavLink to={`${url}/Top`} activeClassName="current-stronghold">Top</NavLink>
                </li>
                <li className="stronghold-nav-item">
                    <NavLink to={`${url}/Mid`} activeClassName="current-stronghold">Mid</NavLink>
                </li>
                <li className="stronghold-nav-item">
                    <NavLink to={`${url}/Bot`} activeClassName="current-stronghold">Bot</NavLink>
                </li>
                <li className="stronghold-nav-item">
                    <NavLink to={`${url}/Main`} activeClassName="current-stronghold">Main</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default TowersNav;