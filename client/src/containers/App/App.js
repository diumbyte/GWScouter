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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TowerEdit from '../../components/TowerEdit/TowerEdit';
import TitledRoute from '../../components/TitledRoute/TitledRoute';

const App = () => {
  toast.configure();
  return (
    <>
      <ToastContainer />
      <Header />
      <Main>
          <Switch>
            <TitledRoute exact path="/">Home page</TitledRoute>
            <TitledRoute exact path="/Home">
              <Redirect to="/"/>
            </TitledRoute>
            <TitledRoute title="User Profile" exact path="/User" component={ User }></TitledRoute>
            <TitledRoute title="Login" exact path="/Login" component={ LoginPage }></TitledRoute>
            <TitledRoute title="Join Guild" exact path="/Guild/Join/:inviteCode" component={JoinGuild}></TitledRoute>
            <TitledRoute title="Guild Profile" exact path="/Guild" component={Guild}></TitledRoute>
            <TitledRoute title="No Guild" exact path="/NoGuild" component={UserWithoutGuild}></TitledRoute>
            {/* Forms */}
            <TitledRoute title="Edit Tower" exact path="/Tower/:towerId" component={TowerEdit} />
            <TitledRoute title="Edit Unit" exact path="/Battle/Unit/:unitId" component={UnitForm} />
            <TitledRoute title="Create Tower" exact path="/Battle/Tower/New" component={TowerForm} />
            <TitledRoute title="Battle" path="/Battle" component={ Battle }></TitledRoute>
            {/* Default 404 Route */}
            {/* <Route component={NoMatch}/> */}
          </Switch>
      </Main>
    </>
  );
}

export default withRouter(App);
