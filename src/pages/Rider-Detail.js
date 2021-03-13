import React from 'react';
import { constants } from '../utils/constants';
import { DataTable} from "mdbreact";
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import Footer from './../components/Footer.js';


import SyncLoader from "react-spinners/SyncLoader";


const override = {
  display: "block",
  borderColor: "red",
  margin: "10%"
};


const greenColor = {color: 'green'};
const redColor = {color: 'red'};
const imgSize = {width: "50px"}


const cols = [
    {
        label: 'Fare',
        field: 'fare',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Total Distance',
        field: 'distance',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Total Time',
        field: 'total_time',
        sort: 'asc',
        width: 270
    },
    {
        label: 'Vehicle',
        field: 'car_type',
        sort: 'asc',
        width: 200
    },
    {
        label: 'Arrived Time',
        field: 'arrived',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Started Time',
        field: 'started',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Completed Time',
        field: 'completed',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Pickup Address',
        field: 'pickup_address',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Destination',
        field: 'dropoff_address',
        sort: 'asc',
        width: 100
    }
];

class RiderRides extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      drivers: [],
    };

  }

  async getDrivers() {

      var arr = [];
      const { match: { params } } = this.props;
      var id = params.id;

      const url = constants.SERVER_URL+"rider/history/"+id;
      const response = await fetch(url);
      const data = await response.json();

      for(var i=0; i< data.length; i++){

        var milliseconds = data[i].total_time * 1000;
        let h,m,s;
        h = Math.floor(milliseconds/1000/60/60);
        m = Math.floor((milliseconds/1000/60/60 - h)*60);
        s = Math.floor(((milliseconds/1000/60/60 - h)*60 - m)*60);

        var total_time = h+" Hours "+m+" Minutes "+s+" Seconds ";
        // var total_time = s+" Minutes "+s+" Seconds ";
    
        var obj = {
            driver_name:  data[i].driver_name,
            fare: "$ "+data[i].fare,
            distance: data[i].distance+" KM",
            total_time: total_time,
            car_type: data[i].car_type.toUpperCase(),
            arrived: data[i].arrived,
            started: data[i].started,
            completed: data[i].completed,
            status: data[i].status,
            pickup_address: data[i].pickup_address,
            dropoff_address: data[i].dropoff_address,
            
        };
        arr.push(obj);
      }


      this.setState({
          drivers: arr,
          loading: false
      });


      
  }

  componentDidMount() {
      this.getDrivers();
  }
 

  


	render(){
        
        const data = {
            columns: cols,
            rows: this.state.drivers
          }

		return(
			<div>
                <Header/>
                <Switch>

				<div class="main-content">

                <section class="section">
                    <div class="section-header">
                        <h1>
                            <Link to="/riders">
                                <button class="btn btn-info">
                                    <i class="fa fa-arrow-left"></i> &nbsp;
                                    Go Back
                                </button>
                            </Link>
                        </h1>
                    </div>
                    <div class="section-body">

                        <div class="col-12 col-md-12 col-lg-12">
                            <div class="card">
                            <div class="card-header">
                                <h4>All Rides</h4>
                            </div>
                            <div class="card-body p-0">

                                <div class="table-responsive">

                                <div class="container">
                                    <div style={ { textAlign: "center" } }>
                                        <SyncLoader
                                            css={override}
                                            size={10}
                                            color={"#123abc"}
                                            loading={this.state.loading}
                                        />
                                    </div>
                                     {!this.state.loading &&
                                        <DataTable striped bordered hover data={data} />
                                     }
                                     {/* <DataTable striped bordered hover data={data} /> */}
                                </div>

                                {/* <table class="table table-striped table-hover" id="save-stage">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Verification Status</th>
                                            <th>Availability Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                <tbody>
                                {drivers.map(item => (
                                    

                                    <tr>

                                    <td>
                                        <img src="https://www.alliancerehabmed.com/wp-content/uploads/icon-avatar-default.png" alt="Driver Name" style={imgSize}/>
                                    </td>

                                    <td>
                                        <a href="javascript:;">
                                        <b>{item.firstName} {item.lastName}</b>
                                        </a>
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.contact}</td>
                                    <td>{item.verification_status ? "Verified".toUpperCase() : "Unverified".toUpperCase()}</td>
                                    <td>{item.status.toUpperCase()}</td>
                                    <td>
                                        
                                        <div class="grid-container">
                                        <div class="grid-item">
                                            <a href="javascript:;" class="btn btn-primary">Location</a>
                                        </div>
                                        <div class="grid-item">
                                            <a href="javascript:;" class="btn btn-success">Rides</a>
                                        </div>
                                        <div class="grid-item">
                                            <a href="javascript:;" class="btn btn-success">Details</a>
                                        </div>
                                        <div class="grid-item">
                                            <a href="javascript:;" class="btn btn-primary">Inactive</a>
                                        </div>
                                        </div>

                                    </td>
                                    </tr>


                                ))}

                                </tbody>

                                    

                                
                                
                                </table> */}
                                </div>
                            </div>
                            <div class="card-footer text-right">
                            
                            </div>
                            </div>
                        </div>


                    </div>
                    </section>

                </div>
            </Switch>
            <Footer/>

			</div>
			)
	}
}
export default RiderRides;