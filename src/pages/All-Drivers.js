import React from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import { DataTable} from "mdbreact";
import { constants } from '../utils/constants';
import axios from 'axios';
import SyncLoader from "react-spinners/SyncLoader";

const width100p     = {width: "100%"}
const width30p      = {width: "30%"}
const headingColor  = {color: "#2c51ed"}
const floatRight    = {float: "right"}
const trashColor    = {color: "#FF6665"}
const banColor      = {color: "#BBBBBB"}
const eyeColor      = {color: "#8097F5"}

const imgSize       = {width: "60px"}

const override = {
    display: "block",
    borderColor: "red",
    margin: "10%"
};


const cols = [
    {
        label: 'Image',
        field: 'image',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Vehicle No.',
        field: 'Vehicle_no',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Phone No.',
        field: 'phone_no',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Driving License',
        field: 'driving_license',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Duty Hours',
        field: 'duty_hours',
        sort: 'asc',
        width: 150
    },
    // {
    //     label: 'City',
    //     field: 'city',
    //     sort: 'asc',
    //     width: 150
    // },
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
        width: 150
    }
];




class AllDrivers extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      success:false,
      error:"",
      loading:true,
      drivers: [],

    };


  }

deleteHandler(i, e) {
    e.preventDefault();
    if( window.confirm('Are you sure you wish to delete this driver?') ){
        var postData = {
            id:i
        }
        const URL = constants.SERVER_URL+"driver/delete";
        axios.post(URL, postData)
        .then(res => {
            this.getDrivers();     
        });
    }
};

async getDrivers() {

    this.setState({
        loading: true
    });

    var arr = [];
    var dArr = [];
    const url = constants.SERVER_URL+"driver";
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
        var driver_id = data[i].id;
         
        var full_name = data[i].full_name;

        var ban = <a href="javascript:;">
        <i class="fa fa-ban" style={banColor}></i>
        </a>

        var trash = <a href="javascript:;" onClick={this.deleteHandler.bind(this, driver_id)}  >
            <i class="fa fa-trash" style={trashColor} ></i>
        </a>

        var eye = <Link to={"driver-detail/"+driver_id}>
            <i class="fa fa-eye" style={eyeColor}></i>
        </Link>
    
        var rides = <a href="javascript:;"><button class='btn btn-primary'> Rides</button></a>

        var grid = <div class="grid-container">
            <div class="grid-item">
                {trash} | {ban} | {eye}
            </div>
        </div>;

      
        var img = <img src={data[i].image} alt={data[i].full_name} style={imgSize}/>;
        var driver_name = <b>Driver No. {i}</b>;
        var Vehicle_no = <b>Vehicle No. {i}</b>;

        var obj = {
            image: img,
            name: full_name,
            Vehicle_no: data[i].vehicle_number,
            phone_no: data[i].phone_no,
            driving_license: data[i].driving_license,
            duty_hours: data[i].duty_hours,
            // city: "Lahore",
            status: data[i].status,
            action: grid
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
    // if(!this.state.isLoggedIn){
		// 	return <Redirect to="/auth"/>
		// }
		// else{
        const data = {
            columns: cols,
            rows: this.state.drivers
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
                                <h3 style={headingColor}>Drivers</h3>
                            </div>
                            <div class="col-6 col-md-6 col-lg-6">
                                <Link to="add-driver" style={floatRight}>
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
export default AllDrivers;