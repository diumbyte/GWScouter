import { Component } from 'react';
import {
    Switch, 
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import AutosuggestInput from '../AutosuggestInput/AutosuggestInput';
import TowersNav from "../../components/TowersNav/TowersNav";
import Zone from "../../components/Zone/Zone";
import AddIcon from '../../assets/plus-circle.svg';
import './Battle.css';
import 'react-router-modal/css/react-router-modal.css';
import axios from 'axios';
import { toast } from 'react-toastify';


class Battle extends Component  {
    constructor(props) {
        super(props);
                
        this.state = {
            searchField: '',
            towersList: [],
        }
    }

    componentDidMount = async () => {

        const redirectPath = window.localStorage.getItem('redirectUrl');
        if(redirectPath) {
            window.localStorage.removeItem('redirectUrl');
            return this.props.history.push(redirectPath);
        }
        
        let res;
        try {
            res = await axios.get('/api/battle');
        } catch(err) {
            const { data } = err.response;

            data.errors.forEach(err => toast.error(`${err.msg}`))
            return this.props.history.push('/NoGuild');
        }
        
        this.setState({
            towersList: res.data
        });
    }

    filteredTowersList = (zone) => {
        zone = zone.toLowerCase();

        return this.state.towersList.filter(team => team.zone === zone);
    }

    onInputChange = (event) => {
        const {target : {value}} = event;

        this.setState(prevState => ({
            ...prevState,
            searchField: value
        }));
    }

    onSuggestionSelected = (event, { suggestion, suggestionValue} ) => {
        const { history } = this.props;
        const { zone, id } = suggestion;

        const zoneNav = zone.charAt(0).toUpperCase() + zone.slice(1);

        history.push(`/Battle/${zoneNav}#${id}`);
    }
    
    render() {
        const { path } = this.props.match;

        return(        
            <>
            <div className="stronghold-header">
                <h3>Enemy Guild</h3>
                <div className="battle-options">
                    <Link to="/Battle/Tower/New" className="add-tower">
                        <img src={AddIcon} className="svg-icon" alt="Add Fort Button"/>
                        <p>Add Tower</p>
                    </Link>
                    <AutosuggestInput 
                        title=""
                        label=""
                        name="searchField"
                        value={this.state.searchField}
                        className="input-half search-field"
                        onChange={this.onInputChange}
                        optionsList={this.state.towersList}
                        placeholder="Search for tower"
                        searchKeys={["username"]}
                        suggestionProp={"enemy_username"}
                        onSuggestionSelected={this.onSuggestionSelected}
                    />
                </div>
            </div>
            <TowersNav />
            <Switch>
                {/* Zones */}
                <Route exact path={`${path}/top`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("top")} /> } 
                />
                <Route exact path={`${path}/mid`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("mid")} /> } 
                />
                <Route exact path={`${path}/bot`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("bot")} /> } 
                />
                <Route path={`${path}/main`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("main")} /> } 
                />
                {/* Default route */}
                <Route exact path={`/Battle`}>
                    <Redirect to={`${path}/Top`}/>
                </Route>
            </Switch>
            </>
        );
    }

}

export default Battle;