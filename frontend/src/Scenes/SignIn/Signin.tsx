import * as React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

const SIGN_IN = gql`
  mutation SIGININ($email: String!, $password: String!) {
    signIn(email:$email, password:$password){
      success
      jwt
    }
  }
`;

const SigIn: React.FunctionComponent<any> = (props: any) => {
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Mutation mutation={SIGN_IN}>
      {(signIn, { loading, data }) => {
        
        if(!loading && data) {
          props.loginAttempt(data.signIn.success);
          sessionStorage.setItem('token', data.signIn.jwt);
        }

        return (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                signIn({ variables: { email , password } });
              }}
            >
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <button type="submit">Sign In</button>
            </form>
          </div>
        );
      }}
    </Mutation>
  );
};

export default SigIn;