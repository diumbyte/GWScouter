import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import Battle from '../Battle/Battle';
import UnitForm from '../UnitForm/UnitForm';
import TowerForm from '../TowerForm/TowerForm';
import Guild from '../Guild/Guild';
import Login from '../Login/Login';
import UserWithoutGuild from '../UserWithoutGuild/UserWithoutGuild';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';

const App = (props) => {
  
  return (
    <>
      <Header />
      <Main>
          <Switch>
            <Route exact path="/">Home page</Route>
            <Route exact path="/Login" component={Login}></Route>
            <Route exact path="/Guild" component={Guild}></Route>
            {/* Forms */}
            <Route exact path="/Battle/Unit/:unitId" component={UnitForm} />
            <Route exact path="/Battle/Tower/New" component={TowerForm} />
            <Route path="/Battle" component={ Battle }></Route>
            {/* Default 404 Route */}
            {/* <Route component={NoMatch}/> */}
          </Switch>
      </Main>
    </>
  );
}

export default withRouter(App);
