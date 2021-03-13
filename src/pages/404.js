import React from 'react';
import { constants } from '../utils/constants';
import { DataTable} from "mdbreact";
import { Link } from 'react-router-dom';
import { Spinner } from '@simply007org/react-spinners';
import SyncLoader from "react-spinners/SyncLoader";


class My404Component extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      drivers: [],
    };

  }

 
  componentDidMount() {

  }
 

  


	render(){
        
		return(
			<div>

            
    <section class="section">
      <div class="container mt-5">
        <div class="row">
          <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
            <div class="card card-primary">
              <div class="card-header">
                <h3>ERROR 404</h3>
              </div>
              <div class="card-body">
                

                <h5>THE PAGE YOU ARE LOOKING IS NOT FOUND</h5>
               
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  

			</div>
			)
	}
}
export default My404Component;