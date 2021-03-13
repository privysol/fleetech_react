import React from 'react';
import { constants } from '../utils/constants';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';


const newImage = {height: "150px", width: "200px"}
const imgSize = {width: "50px"}


class NewDriver extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      error:"",
      image:"",
      full_name:"",
      dob:"",
      cnic:"",
      phone_no:"",
      address:"",
      license_no:"",
      expiry_date:"",
      experience:"1 Year",
      duty_hour:"",
      past_salary:0,
      current_salary:0,
      username:"",
      password:"",
      vehicle_id:"",
      vehicle_name: "",
      vehicle_number: "",
      vehicle_model: "",
      vehicles:[],
    };


  }

  onImageChange = (event) => {
    this.setState({
      driver_image: event.target.files[0]
    });
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          image: e.target.result,
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  fullNameChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Full Name"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({full_name: event.target.value});
  }

  dobChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Date Of Birth"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({dob: event.target.value});
  }

  cnicChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter CNIC"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({cnic: event.target.value});
  }

  phone_noChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Phone Number"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({phone_no: event.target.value});
  }

  addressChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Address"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({address: event.target.value});
  }

  license_noChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter License Number"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({license_no: event.target.value});
  }

  expiry_dateChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter License Expiry Date"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({expiry_date: event.target.value});
  }

  driving_experienceChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Driving Experience"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({experience: event.target.value});
  }

  duty_hoursChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Duty Hours"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({duty_hour: event.target.value});
  }

  past_salaryChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Past Salary"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({past_salary: event.target.value});
  }

  current_salaryChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Current Salary"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({current_salary: event.target.value});
  }

  usernameChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Username"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({username: event.target.value});
  }

  passwordChange = (event) => {
    if(event.target.value === ""){
      this.setState({error: "Please Enter Password"});
    }
    else{
      this.setState({error: ""});
    }  
    this.setState({password: event.target.value});
  }

  vehicleChange = (event) => {
    this.setState({
        vehicle_id: event.target.value,
        vehicle_name: event.target.selectedOptions[0].label
    });
  }

  formSubmit = (event) => {
    this.saveDetails();
    event.preventDefault();
  }

  saveDetails(){

    this.setState({
      saving: true,
    });

    const URL = constants.SERVER_URL+"driver/";

    var image                = this.state.driver_image;
    var full_name            = this.state.full_name;
    var dob                  = this.state.dob;
    var cnic                 = this.state.cnic;
    var phone_no             = this.state.phone_no;
    var address              = this.state.address;
    var driving_license      = this.state.license_no;
    var license_expiry       = this.state.expiry_date;
    var driving_experience   = this.state.experience;
    var duty_hours           = this.state.duty_hour;
    var past_salary          = this.state.past_salary;
    var current_salary       = this.state.current_salary;
    var username             = this.state.username;
    var password             = this.state.password;
    var vehicle_id           = this.state.vehicle_id;
    var vehicle_name         = this.state.vehicle_name;
    var vehicle_number       = this.state.vehicle_number;
    var vehicle_model        = this.state.vehicle_model;



    const formData = new FormData()
    formData.append('image', image);
    formData.append('full_name', full_name);
    formData.append('dob', dob);
    formData.append('cnic', cnic);
    formData.append('phone_no', phone_no);
    formData.append('address', address);
    formData.append('driving_license', driving_license);
    formData.append('license_expiry', license_expiry);
    formData.append('driving_experience', driving_experience);
    formData.append('duty_hours', duty_hours);
    formData.append('past_salary', past_salary);
    formData.append('current_salary', current_salary);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('vehicle_id', vehicle_id);
    formData.append('vehicle_name', vehicle_name);
    formData.append('vehicle_number', vehicle_number);
    formData.append('vehicle_model', vehicle_model);
    axios.post(URL, formData)
    .then(res => {
      
      this.setState({
        image: "",
        full_name: "",
        dob: "",
        cnic: "",
        phone_no: "",
        address: "",
        driving_license: "",
        license_expiry: "",
        driving_experience: "",
        duty_hours: "",
        past_salary: "",
        current_salary: "",
        username: "",
        password: "",
        vehicle_id: "",
        success: false,
        saving: false,
      });
  
      setTimeout(function(){
        this.setState({success:false});
      }.bind(this),3000);
        
    });

  }

async fetchVehicles(){
  var vehicleArr = [];
  const url = constants.SERVER_URL+"vehicle";
  const response = await fetch(url);
  const data = await response.json();


  for(var i=0; i< data.length; i++){   
      var id     = data[i].id;
      var name   = data[i].vehicle_name;
      var number = data[i].vehicle_number;
      var model  = data[i].vehicle_model;
      var obj = {
          id: id,
          name: name,
          number: number,
          model:model
      };
      vehicleArr.push(obj);

  }

 
  this.setState({
      vehicles: vehicleArr,
      vehicle_id: data[0].id,
      vehicle_name: data[0].vehicle_name,
      vehicle_number: data[0].vehicle_number,
      vehicle_model: data[0].vehicle_model,
  });
}

componentDidMount() {
    this.fetchVehicles();
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
                        <Link to="drivers">
                        <h1><i class="fa fa-arrow-left"></i> Add New Driver</h1>
                        </Link>
                    </div>
                    <div class="section-body">
                        

                        <div class="col-12 col-md-12 col-lg-12">
                            <div class="card">
                                 <form novalidate="true" onSubmit={this.formSubmit} enctype="multipart/form-data">

                                    <div class="form-group row">
                                    <div class="col-sm-4"></div>
                                    <div class="col-sm-4" style={{ marginTop: "5%" }}>
                                        <img style={newImage} src={this.state.image} alt="" id="image"/> <br/> <br/>
                                        <input type="file" name="image" class="form-control" required="" accept="image/*" onChange={this.onImageChange}/>
                                        <div class="invalid-feedback">
                                            Please Select Image
                                        </div>
                                    </div>
                                    <div class="col-sm-4"></div>
                                    </div>

                                    <div class="card-header">
                                    <h4>Driver's Basics Details</h4>
                                    </div>
                                    <div class="card-body">
                                    
                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Full Name</label>
                                        <div class="col-sm-9">
                                        <input type="text" name="full_name" value={this.state.full_name} class="form-control" onChange={this.fullNameChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Full Name
                                        </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Date Of Birth</label>
                                        <div class="col-sm-9">
                                        <input type="date" name="date_of_birth" value={this.state.dob} class="form-control" required="" onChange={this.dobChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Date Of Birth
                                        </div>
                                        </div>
                                    </div>
                                    

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">CNIC</label>
                                        <div class="col-sm-9">
                                        <input type="text" name="cnic" value={this.state.cnic} class="form-control" required="" onChange={this.cnicChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter CNIC
                                        </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Phone No.</label>
                                        <div class="col-sm-9">
                                        <input type="text" name="phone_number" value={this.state.phone_no} class="form-control" required="" onChange={this.phone_noChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Phone No.
                                        </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Address</label>
                                        <div class="col-sm-9">
                                        <input type="text" name="address" value={this.state.address} class="form-control" required="" onChange={this.addressChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Address
                                        </div>
                                        </div>
                                    </div>


                                    </div>

                                    <div class="card-header">
                                    <h4>Professional Details</h4>
                                    </div>
                                    <div class="card-body">

                                    <div class="form-group row">
                                      <label class="col-sm-3 col-form-label">Select Vehicle</label>
                                      <div class="col-sm-9">

                                          <select class="form-control" onChange={this.vehicleChange}>
                                          {this.state.vehicles.map(item => (
                                              <option value={item.id}>{item.name}</option>
                                          ))}
                                          </select>
                                      </div>
                                  </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Driving License No.</label>
                                        <div class="col-sm-9">
                                        <input type="text" name="license_no" value={this.state.license_no} class="form-control" required="" onChange={this.license_noChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Driving License No.
                                        </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">License Expiry Date</label>
                                        <div class="col-sm-9">
                                        <input type="date" name="license_expiry_date" value={this.state.license_expiry} class="form-control" required="" onChange={this.expiry_dateChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter License Expiry Date
                                        </div>
                                        </div>
                                    </div>
                                    

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Driving Experience</label>
                                        <div class="input-group col-sm-9">
                                        
                                          <select class="form-control" name="driving_experience" value={this.state.experience} onChange={this.driving_experienceChange}>
                                              <option value="1 Year">1 Year</option>
                                              <option value="2 Years">2 Years</option>
                                              <option value="3 Years">3 Years</option>
                                              <option value="4 Years">4 Years</option>
                                              <option value="5 Years">5 Years</option>
                                              <option value="6 Years">6 Years</option>
                                              <option value="7 Years">7 Years</option>
                                              <option value="8 Years">8 Years</option>
                                              <option value="9 Years">9 Years</option>
                                              <option value="10 Years">10 Years</option>
                                          </select>

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Duty Hours</label>
                                        <div class="input-group col-sm-9">
                                        
                                        <select class="form-control" name="duty_hours" onChange={this.duty_hoursChange}>
                                            <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM</option>
                                            <option value="12:00 PM - 04:00 PM">12:00 PM - 04:00 PM</option>
                                            <option value="04:00 PM - 08:00 PM">04:00 PM - 08:00 PM</option>
                                            <option value="08:00 PM - 12:00 AM">08:00 PM - 12:00 AM</option>
                                            <option value="12:00 AM - 04:00 AM">12:00 AM - 04:00 AM</option>
                                            <option value="04:00 AM - 08:00 AM">04:00 AM - 08:00 AM</option>
                                        </select>

                                        </div>
                                    </div>


                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Past Salary</label>
                                        <div class="input-group col-sm-9">
                                        <input type="number" name="past_salary" value={this.state.past_salary} class="form-control currency" onChange={this.past_salaryChange}/>
                                        </div>
                                        <div class="invalid-feedback">
                                        Please Enter Past Salary
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Current Salary</label>
                                        <div class="input-group col-sm-9">
                                        <input type="number" name="current_salary" value={this.state.current_salary} class="form-control currency" onChange={this.current_salaryChange}/>
                                        </div>
                                        <div class="invalid-feedback">
                                        Please Enter Current Salary
                                        </div>
                                    </div>

                                    </div>


                                    <div class="card-header">
                                    <h4>Account Information</h4>
                                    </div>
                                    <div class="card-body">

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Username</label>
                                        <div class="col-sm-9">
                                        <input type="text" name="username" class="form-control" value={this.state.username} required="" onChange={this.usernameChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Username
                                        </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-3 col-form-label">Password</label>
                                        <div class="col-sm-9">
                                        <input type="password" name="password" value={this.state.password} class="form-control" required="" onChange={this.passwordChange}/>
                                        <div class="invalid-feedback">
                                            Please Enter Password
                                        </div>
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
export default NewDriver;