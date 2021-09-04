import { AuthProvider } from "../Context/AuthContext";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import GoLink from "./GoLink";

function App() {
    
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard}/>
          <PrivateRoute exact path="/update-profile" component={UpdateProfile}/>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/:shortUrl" component={GoLink} />
        </Switch>
      </AuthProvider>
    </Router>
      
  )
}


export default App;
