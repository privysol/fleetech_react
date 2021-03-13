import React from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import axios from 'axios';
import { constants } from '../utils/constants';


class ScheduleVehicle extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      schedules: [],
    };


  }

  deleteHandler(i, e) {
    e.preventDefault();
    if( window.confirm('Are you sure you wish to delete this schedule?') ){
        var postData = {
            id:i
        }
        const URL = constants.SERVER_URL+"schedule/delete";
        axios.post(URL, postData)
        .then(res => {
            this.getSchedule();     
        });
    }
};

async getSchedule() {

    var arr = [];
    const url = constants.SERVER_URL+"schedule";
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
      var dId = data[i].id;

      var sTime = this.tConvert(data[i].start_time);
      var eTime = this.tConvert(data[i].end_time);
      var distance = this.calculateDistance(data[i]['pickup'][0].lat, data[i]['pickup'][0].lon, data[i]['dropOff'][0].lat, data[i]['dropOff'][0].lon);

        var obj = {
            id                : data[i]._id,
            schedule_date     : data[i].schedule_date,
            driver_id         : data[i].driver_id,
            driver_name       : data[i].driver_name,
            driver_number     : data[i].driver_number,
            start_time        : sTime,
            end_time          : eTime,
            vehicle_id        : data[i].vehicle_id,
            vehicle_name      : data[i].vehicle_name,
            vehicle_number    : data[i].vehicle_number,
            status            : data[i].status,
            pickup_address    : data[i]['pickup'][0].address,
            pickup_lat        : data[i]['pickup'][0].lat,
            pickup_lon        : data[i]['pickup'][0].lon,
            dropOff_address   : data[i]['dropOff'][0].address,
            dropOff_lat       : data[i]['dropOff'][0].lat,
            dropOff_lon       : data[i]['dropOff'][0].lon,
            total_distance    : distance,

        };
        arr.push(obj);
    }


    this.setState({
        schedules: arr,
        loading: false
    });


    
}

tConvert = (time) => {
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    time = time.slice (1);
    time[5] = +time[0] < 12 ? ' AM' : ' PM';
    time[0] = +time[0] % 12 || 12;
  }
  return time.join ('');
}

calculateDistance = (lat1, lon1, lat2, lon2) => {
    
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  const finalDistance = Number(Math.round(d/1000+'e'+2)+'e-'+2); // in KM
  return finalDistance;
}

componentDidMount() {
    this.getSchedule();
}


	render(){
    // if(!this.state.isLoggedIn){
		// 	return <Redirect to="/auth"/>
		// }
		// else{
      return(
        <div>
            <Header/>
            <Switch>
            <div>
              <div class="main-content">
                <div class="row">
                  <div class="col-12 col-sm-12 col-lg-12">
                    <div class="card">
                      <div class="card-header">
                        <div class="row" style={{ width: "100%" }}>
                          <div class="col-6 col-md-6 col-lg-6">
                            <h3 style={{ color: "#2c51ed" }}>Vehicle Scheduling</h3>
                          </div>
                          <div class="col-6 col-md-6 col-lg-6">
                            <Link to="schedule-bus" style={{ float: "right" }}>
                              <button class="btn btn-primary"><i class="fa fa-plus"></i> Schedule Bus</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      {this.state.schedules.map(item =>
                        <div id="card">
                          <div class="row">
                            <div class="col-1">
                              <img src="assets/img/user.png" id="img"/>
                            </div>
                            <div class="col-5" style={{ borderRight: "1px solid #9F9F9F" }}>
                              <div class="row">
                                <div class="col-auto" >
                                  <p id="small_title">Driver Name</p>
                                  <p id="subtitle">{item.driver_name}</p>
                                </div>
                                <div class="col-auto">
                                  <p id="small_title">Vehicle Number</p>
                                  <p id="subtitle">{item.vehicle_number}</p>
                                </div>
                                <div class="col-auto">
                                  <p id="small_title">Vehicle Name</p>
                                  <p id="subtitle">{item.vehicle_name}</p>
                                </div>
                                <div class="col-auto">
                                  <p id="small_title">Travel Date</p>
                                  <p id="subtitle">{item.schedule_date}</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-2">
                              <div class="row">
                                <div class="col-2">
                                  <img src="assets/img/locationicon.png" id="img_second"/>
                                </div>
                                <div class="col-8" id="timing">
                                  <p id="location_time">{item.start_time}</p>
                                  <p id="location_time" class="location_botom">{item.end_time}</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-2">
                                <table class="table table-responsive">
                                    <tbody>
                                        <tr id="location_name">
                                        {item.pickup_address}
                                        </tr>
                                        <tr id="location_name">
                                        {item.dropOff_address}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-2">
                              <div style={{ display: "inline-block" }}>
                                <h5 style={{ color: "#4161F0", display: "inline-block" }}><img src="assets/img/locmarker.png"/>{item.total_distance} KM</h5>
                                &ensp;&ensp;&ensp;
                                <a href="javascript:;" onClick={this.deleteHandler.bind(this, item.id)}>
                                  <i class="fa fa-trash" style={{ color: "red", display: "inline-block" }}></i>
                                </a>
                              </div>
                              <img src="assets/img/bus.png" id="bus_img" style={{ width: "100%" }}/>
                            </div>
                          </div>
                          <hr/>
                        </div>
                      )} 
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            </Switch>
        </div>
        )
    }
	}
// }
// export default Dashboard;
export default ScheduleVehicle;