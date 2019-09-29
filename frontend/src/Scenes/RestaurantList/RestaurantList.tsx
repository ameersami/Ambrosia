import * as React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const SEARCH_RESTAURANTS = gql`
  query searchRestaurants($jwt: String,$latitude: Float!, $longitude: Float!) {
    searchRestaurants(jwt: $jwt, latitude: $latitude, longitude: $longitude){
      total
      business {
        name
      }
    }
  }
`;

const RestaurantList: React.FunctionComponent<{}> = (props: any) => {

  if(!props.loggedIn) {
    return (
      <h1>Test</h1>
    );
  }

  return (
    <Query query={SEARCH_RESTAURANTS} variables={{ latitude: props.location[0], longitude: props.location[1], jwt: sessionStorage.getItem('token') }}>
      {({loading, error, ...rest}) => {
        return (
          <div>
            <h1>Data:</h1>
            {console.log(rest)}
            {console.log(sessionStorage.getItem('token'))}
          </div>
        )
      }}
    </Query>
  );

}

export default RestaurantList;