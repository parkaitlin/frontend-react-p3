import './App.css'
import React, {Component} from 'react';
import{Switch, Route} from 'react-router-dom';
import * as routes from './Components/constants/routes';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

//NavBar:
import NavBar from './Components/NavBar/Navbar';

//Components:
import Enter from './Components/Enter/Enter';
import Login from './Components/Login/Login';
import Registration from './Components/Registration/Registration';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Bear from './Components/Snacks/Bear';
import Drop from './Components/Snacks/Drop';
import Munch from './Components/Snacks/Munch';
import Profile from './Components/Profile/Profile';

class App extends Component {
  state = {
    registered: false,
    logged: false,
    password: '',
    message: '',
    name: '',
    currentUser: '',
    loading: true,
    showSideBar: false,
  }
  openBar = ()=>{
    this.setState({
        showSideBar: true
    })
  }
  closeBar = ()=>{
    this.setState({
        showSideBar: false
    })
  }
  register = async (info)=>{
    try {
      const data = await fetch('/auth/register', {
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(info),
          headers: {
            'Content-Type': 'application/json'
          }
      })
      const parsedData = await data.json();
      if(parsedData.data === 'user created'){
        this.setState({
          registered: true,
          logged: true,
          name: parsedData.user.firstName,
          currentUser: parsedData.user
        })
      } else {
        this.setState({
          message: parsedData.message  
        })
      }
  } catch (error) {
      console.log(error)
    } 
  }
  login = async (info)=>{
    try {
      const loginResponse = await fetch('/auth/login', {
          method:"POST",
          credentials: 'include',
          body: JSON.stringify(info),
          headers: {
            'Content-Type': 'application/json'
          }
      })
      const parsedResponse = await loginResponse.json()
      if(parsedResponse.data === 'login successful'){
          this.setState({
            logged: true,
            name: parsedResponse.user.firstName,
            currentUser: parsedResponse.user
          })
      } else {
          this.setState({
              password: '',
              message: parsedResponse.message
          })
      }
  } catch (error) {
      console.log(error)
  }
  }
  logout = async () => {
    try {
      const logoutResponse = await fetch('/auth/logout', {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await logoutResponse.json();
      this.setState({
        logged: false,
        message: parsedResponse.message
      })
      this.closeBar()
    } catch (error) {
      console.log(error)
    }
  }
  clearMessage = ()=>{
    this.setState({
      message: ''
    })
    this.closeBar()
  }
  updateUser = (info)=>{
    this.setState({
      currentUser: (info)
    })
  }
  deleteUser = async()=>{
    try {
      const data = await fetch('/user/deactivate', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedData = await data.json();
      this.setState({
        logged: false,
        message: parsedData.message
      })

    } catch (error) {
      console.log(error)
    }
  }
  editUser = async(info)=>{
    try {
      const data = await fetch('/user/edit', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(info),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedData = await data.json();
      this.setState({
        currentUser: parsedData.user
      })
    } catch (error) {
      console.log(error)
    }
  }
  render(){
    const {registered, logged, password, message, name, currentUser} = this.state
    return (
      <div className="App">
          <TransitionGroup>
            <NavBar logged={logged} logout={this.logout} getUser={this.getUser} clearMessage={this.clearMessage} closeBar={this.closeBar} openBar={this.openBar} show={this.state.showSideBar}/>
            <CSSTransition timeout={3000} classNames="fadeTwo">
              <Switch>
                <Route exact path={routes.ENTER} render={() => <Enter />} />
                <Route exact path={routes.LOGIN} render={() => <Login logged={logged} password={password} message={message} login={this.login} />} />
                <Route exact path={routes.REGISTER} render={()=> <Registration logged={logged} message={message} register={this.register} />} />
                <Route exact path={routes.HOME} render={()=> <Home resetLoader={this.resetLoader} getBear={this.getBear} getDrop={this.getDrop} getMunchie={this.getMunchie} logged={logged} registered={registered} name={name} />} />
                <Route exact path={routes.ABOUT} render={()=> <About />} />
                <Route exact path={routes.PROFILE} render={()=> <Profile logged={logged} deleteUser={this.deleteUser} currentUser={currentUser} editUser={this.editUser} updateUser={this.updateUser} />} />
                <Route exact path={routes.BEAR} render={()=> <Bear logged={logged} />} />
                <Route exact path={routes.DROP} render={()=> <Drop logged={logged} />} />
                <Route exact path={routes.MUNCH} render={()=> <Munch logged={logged} updateUser={this.updateUser} />} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
      </div>
    );
  }
}

export default App;
