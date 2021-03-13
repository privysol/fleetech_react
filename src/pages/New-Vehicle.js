import React from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import { constants } from '../utils/constants';
import { FadeLoader } from 'react-spinners';
import { Alert } from 'react-bootstrap';


const newImage = {height: "150px", width: "200px"}
const imgSize = {width: "50px"}

class NewVehicle extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      error:"",
      success: false,
      vehicle_model:"",
      vehicle_name:"",
      vehicle_number:"",
      vehicle_brand:"",
      total_seats:0,
      fuel_capacity:0,
      aircondition:"Yes",
      accident:0,
      fuel_consumption:0,
    };


  }

  modelChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Vehicle Model"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({vehicle_model: event.target.value});
  }
  
  nameChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Vehicle Name"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({vehicle_name: event.target.value});
  }
  
  numberChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Vehicle Number"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({vehicle_number: event.target.value});
  }

  brandChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Vehicle Brand"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({vehicle_brand: event.target.value});
  }

  seatsChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Total Seats"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({total_seats: event.target.value});
  }

  fuelChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Fuel Capacity"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({fuel_capacity: event.target.value});
  }

  acChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Choose Airconditioning"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({aircondition: event.target.value});
  }

  accidentChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Accident"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({accident: event.target.value});
  }

  fuelConsumptionChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Fuel Consumption"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({fuel_consumption: event.target.value});
  }

  formSubmit = (event) => {
    this.saveDetails();
    event.preventDefault();
  }

  saveDetails(){

    this.setState({
      saving: true,
    });

    const URL = constants.SERVER_URL+"vehicle/";

    var vehicle_model     = this.state.vehicle_model;
    var vehicle_name      = this.state.vehicle_name;
    var vehicle_number    = this.state.vehicle_number;
    var vehicle_brand     = this.state.vehicle_brand;
    var total_seats       = this.state.total_seats;
    var fuel_capacity     = this.state.fuel_capacity;
    var aircondition      = this.state.aircondition;
    var accident          = this.state.accident;
    var fuel_consumption  = this.state.fuel_consumption;

    if(vehicle_model === "" || vehicle_name === "" || vehicle_number === "" || vehicle_brand === "" || 
    total_seats === "" || fuel_capacity === "" || aircondition === "" || accident === "" || fuel_consumption === ""){
        alert("All Fields are required");
    }
    else {
        var postData = {
            vehicle_model: vehicle_model,
            vehicle_name: vehicle_name,
            vehicle_number: vehicle_number,
            vehicle_brand: vehicle_brand,
            total_seats: total_seats,
            fuel_capacity: fuel_capacity,
            air_conditioning: aircondition,
            accidents: accident,
            fuel_consumption: fuel_consumption
        };
    
        axios.post(URL, postData)
        .then(res => {
    
          this.setState({
            vehicle_model: "",
            vehicle_name: "",
            vehicle_number: "",
            vehicle_brand: "",
            total_seats: "",
            fuel_capacity: 0,
            aircondition: "Yes",
            accident: 0,
            fuel_consumption: 0,
            success: true,
            saving: false,
          });
    
        setTimeout(function(){
            this.setState({success:false});
        }.bind(this),3000);
            
        });
    }

  }


	render(){
      return(
        <div>
            <Header/>
            <Switch>
            <div>
                <div class="main-content">
                <section class="section">
                    <div class="section-header">
                        <Link to="vehicles">
                        <h1><i class="fa fa-arrow-left"></i> Add New Vehicle</h1>
                        </Link>
                    </div>
                    <div class="section-body">
                        

                        <div class="col-12 col-md-12 col-lg-12">
                            <div class="card">
                            <form novalidate="true" onSubmit={this.formSubmit} enctype="multipart/form-data">
                                <div class="card-header">
                                <h4>Vehicle Basics</h4>
                                </div>
                                <div class="card-body">

                                {this.state.success && (
                                    <Alert
                                    variant="success"
                                    dismissible
                                    onClose={() => this.setState({success:false})}
                                    >
                                    <Alert.Heading>
                                    <strong>Success!</strong> Vehicle Added Successfully
                                    </Alert.Heading>
                                    </Alert>

                                    )}

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Vehicle Model</label>
                                    <div class="col-sm-9">
                                    <input type="text" name="schedule_date" value={this.state.vehicle_model} class="form-control" onChange={this.modelChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Vehicle Model
                                    </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Vehicle Name</label>
                                    <div class="col-sm-9">
                                    <input type="text" name="schedule_date" value={this.state.vehicle_name} class="form-control" required="" onChange={this.nameChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Vehicle Name
                                    </div>
                                    </div>
                                </div>
                                

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Vehicle Number</label>
                                    <div class="col-sm-9">
                                    <input type="text" name="schedule_date" value={this.state.vehicle_number} class="form-control" required="" onChange={this.numberChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Vehicle Number
                                    </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Vehicle Brand</label>
                                    <div class="col-sm-9">
                                    <input type="text" name="schedule_date" value={this.state.vehicle_brand} class="form-control" required="" onChange={this.brandChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Vehicle Brand
                                    </div>
                                    </div>
                                </div>


                                </div>

                                <div class="card-header">
                                <h4>Vehicle Specs</h4>
                                </div>
                                <div class="card-body">

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Total Seats</label>
                                    <div class="col-sm-9">
                                    <input type="number" name="schedule_date" value={this.state.total_seats} class="form-control" required="" onChange={this.seatsChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Total Seats
                                    </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Fuel Capacity</label>
                                    <div class="col-sm-9">
                                    <input type="number" name="schedule_date" value={this.state.fuel_capacity} class="form-control" required=""  onChange={this.fuelChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Fuel Capacity
                                    </div>
                                    </div>
                                </div>
                                

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Airconditioning</label>
                                    <div class="input-group col-sm-9">
                                    
                                    <select class="form-control" onChange={this.acChange}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>

                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Accident</label>
                                    <div class="input-group col-sm-9">
                                    <input type="number" name="accident"  value={this.state.accident} class="form-control currency" onChange={this.accidentChange}/>
                                    </div>
                                    <div class="invalid-feedback">
                                    Please Enter Accident
                                    </div>
                                </div>


                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Fuel Consumption/km</label>
                                    <div class="input-group col-sm-9">
                                    <input type="number" name="fuel_consumption" value={this.state.fuel_consumption} class="form-control" onChange={this.fuelConsumptionChange}/>
                                    </div>
                                    <div class="invalid-feedback">
                                    Please Enter Fuel Consumption/km
                                    </div>
                                </div>

                                </div>

                                <div class="card-footer text-right">
                                <button type="submit" class="btn btn-primary">Submit</button>
                                </div>
                            </form>
                            </div>
                        </div>


                    </div>
                    </section>
                </div>
            </div>

            </Switch>
        </div>
        )
    }
}
export default NewVehicle;