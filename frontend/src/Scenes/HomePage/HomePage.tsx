import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'

import SigIn from '../SignIn/Signin';
import RestaurantList from '../RestaurantList/RestaurantList';

const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  mode: 'no-cors'
})
const client = new ApolloClient({ link, cache: new InMemoryCache() });

class HomePage extends React.PureComponent<{}> {

  state: any = {
    loggedIn: false,
    userLocation: null
  };

  loginAttempt = (success: boolean) => {
    this.setState({
      loggedIn: success
    });
  }

  retrieveUserLocation = async () => {
    if(navigator.geolocation){
      await navigator.geolocation.getCurrentPosition(this.setUserLocation);
    }
  }

  setUserLocation = (position: any) => {
    this.setState({
      userLocation: [ position.coords.latitude, position.coords.longitude]
    });
  };

  componentDidMount = () => {
    this.retrieveUserLocation();
  }

  render(){
    return(
      <ApolloProvider client={client}>
        <SigIn loginAttempt={this.loginAttempt}/>
        <h1>Is Loggedin: {this.state.loggedIn.toString()}</h1>
        <RestaurantList loggedIn={this.state.loggedIn} location={this.state.userLocation}/>
        <h1>Location: {JSON.stringify(this.state.userLocation)}</h1>
      </ApolloProvider>
    )
  }

};

export default HomePage;