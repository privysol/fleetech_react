import * as React from 'react';
import SyncLoader from "react-spinners/SyncLoader";

const override = {
    display: "block",
    borderColor: "red",
    margin: "10%"
  };
 
class Loader extends React.Component {

  render(loading) {
    return (
      <div>
        <SyncLoader
            css={override}
            size={10}
            color={"#123abc"}
            loading={loading}
        />
      </div>
    );
  }
}

export default Loader;