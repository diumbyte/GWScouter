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
import SampleBattleInput from '../../assets/SampleData/SampleBattleInput.json'

class Battle extends Component  {
    constructor(props) {
        super(props);
                
        this.state = {
            searchField: '',
            towersList: []
        }
    }

    componentDidMount() {
        this.setState({
            towersList: SampleBattleInput
        });
        console.log("Battle componentDidMount call");
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
        const { zone } = suggestion;

        history.push(`/Battle/${zone}`);
    }
    
    render() {
        const { path } = this.props.match;

        return(        
            <>
            <div className="stronghold-header">
                <h3>Enemy Guild Placeholder</h3>
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
                        suggestionProp={"username"}
                        onSuggestionSelected={this.onSuggestionSelected}
                    />
                </div>
            </div>
            <TowersNav />
            <Switch>
                {/* Zones */}
                <Route exact path={`${path}/Top`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("top")} /> } 
                />
                <Route exact path={`${path}/Mid`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("mid")} /> } 
                />
                <Route exact path={`${path}/Bot`} component={() => 
                    <Zone filteredTowersList={this.filteredTowersList("bot")} /> } 
                />
                <Route path={`${path}/Main`} component={() => 
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