import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import Header from "./components/Header";
import { Settings } from "./pages/Settings";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <UserProvider>
          <Router>
            <Header />
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/settings" component={Settings} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </Router>
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
