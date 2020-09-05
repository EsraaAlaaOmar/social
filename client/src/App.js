import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import Navbar from '../src/components/layout/Navbar'
import Landing from '../src/components/layout/Landing'
import Login from '../src/components/auth/Login'
import Register from '../src/components/auth/Register'
import Alert from '../src/components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/layout/profile-forms/CreateProfile'
import EditProfile from './components/layout/profile-forms/EditProfile'
import AddExperience from './components/layout/profile-forms/AddExperience'
import AddEducation from './components/layout/profile-forms/AddEducation'
import Profiles from './components/profiles/Profile'
import Profile from './components/profile/Profile'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'
import PrivateRoute from './components/routing/PrivateRoute'

//Redux
import{ Provider } from 'react-redux'
import store from './store'
import {loadUser} from './actions/auth'
import setAuthToken from './utilis/setAuthToken'

if(localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(()=>{
  store.dispatch(loadUser())
  }, [])
return(
<Provider store = {store}>
<Router>
<Fragment>
 <Navbar />
 <Route exact path='/' component={Landing} />
 <section className="container">
   <Alert />
  <Switch>
    <Route exact path='/register' component={Register} />
    <Route exact path='/login' component={Login} />
    <Route exact path='/profiles' component={Profiles} />
    <Route exact path='/profile/:id' component={Profile} />
    <PrivateRoute exact path='/dashboard' component={Dashboard} />
    <PrivateRoute exact path='/create-profile' component={CreateProfile} />
    <PrivateRoute exact path='/edit-profile' component={EditProfile} />
    <PrivateRoute exact path='/add-experience' component={AddExperience} />
    <PrivateRoute exact path='/add-education' component={AddEducation} />
    <PrivateRoute exact path='/posts' component={Posts} />
    <PrivateRoute exact path='/posts/:id' component={Post} />
  </Switch>

 </section>
</Fragment>
</Router>
</Provider>
)}
export default App;
