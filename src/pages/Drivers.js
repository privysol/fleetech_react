import React from 'react';
import { constants } from '../utils/constants';
import { DataTable} from "mdbreact";
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import Footer from './../components/Footer.js';
import { Spinner } from '@simply007org/react-spinners';
import SyncLoader from "react-spinners/SyncLoader";



const greenColor = {color: 'green'};
const redColor = {color: 'red'};
const imgSize = {width: "50px"}

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
        label: 'Email',
        field: 'email',
        sort: 'asc',
        width: 270
    },
    {
        label: 'Contact Number',
        field: 'contact',
        sort: 'asc',
        width: 200
    },
    {
        label: 'Status',
        field: 'status',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Verification Status',
        field: 'verificationStatus',
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

class Drivers extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      drivers: [],
    };

  }

  async getDrivers() {

      var arr = [];
      const url = constants.SERVER_URL+"driver";
      const response = await fetch(url);
      const data = await response.json();

      var verified = <p style={greenColor}>VERIFIED</p>;
      var unverified = <p style={redColor}>UNVERIFIED</p>;

      for(var i=0; i< data.length; i++){
        var dId = data[i].id;
        var buttons =   <Link to= {'driver-details/'+dId} >
			<a href="javascript:;"><button class='btn btn-success'> Details</button></a>
        </Link>

        var rides =   <Link to= {'driver-rides/'+dId} >
        <a href="javascript:;"><button class='btn btn-primary'> Rides</button></a>
        </Link>

        var grid = <div class="grid-container">
            <div class="grid-item">
                {rides}
            </div>
            <div class="grid-item">
                {buttons}
            </div>
        </div>;

        // var buttons = <a href="javascript:;"><button class='btn btn-success'> Detail <i class="fa fa-arrow-right"></i></button></a>;
        var img = <img src={data[i].image} alt={data[i].name} style={imgSize}/>;
        var obj = {
            image: img,
            name: data[i].name,
            email: data[i].email,
            contact: data[i].contact,
            status: data[i].status.toUpperCase(),
            verificationStatus: data[i].verification_status ? verified : unverified,
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
                        <h1>Drivers</h1>
                    </div>
                    <div class="section-body">

                        <div class="col-12 col-md-12 col-lg-12">
                            <div class="card">
                            <div class="card-header">
                                <h4>All Drivers</h4>
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
export default Drivers;