import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import Battle from '../Battle/Battle';
import UnitForm from '../UnitForm/UnitForm';
import TowerForm from '../TowerForm/TowerForm';
import Guild from '../Guild/Guild';
import LoginPage from '../LoginPage/LoginPage';
import UserWithoutGuild from '../UserWithoutGuild/UserWithoutGuild';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import './App.css';
import User from '../User/User';
import JoinGuild from '../JoinGuild/JoinGuild';

const App = () => {
  
  return (
    <>
      <Header />
      <Main>
          <Switch>
            <Route exact path="/">Home page</Route>
            <Route exact path="/Home">
              <Redirect to="/"/>
            </Route>
            <Route exact path="/User" component={ User }></Route>
            <Route exact path="/Login" component={ LoginPage }></Route>
            <Route exact path="/Guild/Join/:inviteCode" component={JoinGuild}></Route>
            <Route exact path="/Guild" component={Guild}></Route>
            <Route exact path="/NoGuild" component={UserWithoutGuild}></Route>
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
