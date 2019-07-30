import * as React from 'react';

class HomePage extends React.PureComponent<{}> {

  render(){
    return(
      <div>
        <div className="leftColumn">
          <h1>Left Column</h1>
        </div>
        <div className="rightColumn">
          <h1>Right Column</h1>
        </div>
      </div>
    )
  }

};

export default HomePage;