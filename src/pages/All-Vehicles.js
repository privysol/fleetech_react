import React from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import { DataTable} from "mdbreact";
import axios from 'axios';
import { constants } from '../utils/constants';
import SyncLoader from "react-spinners/SyncLoader";

const width100p     = {width: "100%"}
const width30p      = {width: "30%"}
const headingColor  = {color: "#2c51ed"}
const floatRight    = {float: "right"}
const trashColor    = {color: "#FF6665"}
const banColor      = {color: "#BBBBBB"}
const eyeColor      = {color: "#8097F5"}

const imgSize       = {width: "70px"}

const override = {
    display: "block",
    borderColor: "red",
    margin: "10%"
};

const cols = [
    {
        label: 'Vehicle Name',
        field: 'vehicle_name',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Vehicle Model',
        field: 'vehicle_model',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Vehicle No.',
        field: 'vehicle_no',
        sort: 'asc',
        width: 170
    },
    {
        label: 'Milage',
        field: 'milage',
        sort: 'asc',
        width: 100
    },
    {
        label: 'No. Of Seats',
        field: 'no_of_seats',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Status',
        field: 'status',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Action',
        field: 'action',
        sort: 'asc',
        width: 100
    }
];




class AllVehicles extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      success:false,
      error:"",
      loading: true,
      vehicles: [],

    };


  }


  deleteHandler(i, e) {
    e.preventDefault();
    if( window.confirm('Are you sure you wish to delete this vehicle?') ){
        var postData = {
            id:i
        }
        const URL = constants.SERVER_URL+"vehicle/delete";
        axios.post(URL, postData)
        .then(res => {
            this.getVehicles();     
        });
    }
};

async getVehicles() {

    this.setState({
        loading: true
    });
    
    var arr = [];
    const url = constants.SERVER_URL+"vehicle";
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
      var dId = data[i].id;
      var trash = <a href="javascript:;" onClick={this.deleteHandler.bind(this, dId)} >
            <i class="fa fa-trash" style={trashColor}></i>
        </a>

        var ban = <a href="javascript:;">
        <i class="fa fa-ban" style={banColor}></i>
        </a>

        var eye = <Link to={"vehicle-tracking/"+dId}>
            <i class="fa fa-eye" style={eyeColor}></i>
        </Link>
    
        var rides = <a href="javascript:;"><button class='btn btn-primary'> Rides</button></a>

        var grid = <div class="grid-container">
            <div class="grid-item">
                {trash} | {ban} | {eye}
            </div>
        </div>;

        var obj = {
            vehicle_name: data[i].vehicle_name,
            vehicle_model: data[i].vehicle_model,
            vehicle_no: data[i].vehicle_number,
            milage: data[i].fuel_consumption,
            no_of_seats: data[i].total_seats,
            status: data[i].status,
            action: grid
        };
        arr.push(obj);
    }


    this.setState({
        vehicles: arr,
        loading: false
    });


    
}

componentDidMount() {
    this.getVehicles();
}


	render(){
    // if(!this.state.isLoggedIn){
		// 	return <Redirect to="/auth"/>
		// }
		// else{
        const data = {
            columns: cols,
            rows: this.state.vehicles
        }
      return(
        <div>
        <Header/>
            <Switch>
            <div class="main-content">
                <div class="row">
                    <div class="col-12 col-sm-12 col-lg-12">
                        <div class="card">
                        <div class="card-header">
                            <div class="row" style={width100p}>
                            <div class="col-6 col-md-6 col-lg-6">
                                <h3 style={headingColor}>Vehicles</h3>
                            </div>
                            <div class="col-6 col-md-6 col-lg-6">
                                <Link to="add-bus" style={floatRight}>
                                <button  class="btn btn-primary"><i class="fa fa-plus"></i> Add New</button>
                                </Link>
                            </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
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
                        </div>
                        </div>
                        </div>
                    </div>

                    </div>
            </div>

            
            </Switch>
        {/* <Footer/> */}
        </div>
        
        )
    }
	}
// }
export default AllVehicles;