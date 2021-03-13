import React from 'react';
import './App.css';

import My404Component   from './pages/404';
import {Routes}         from './pages/Routes.js';
import Login            from './pages/Login';
import Dashboard        from './pages/Dashboard';

import AllVehicles      from './pages/All-Vehicles.js';
import AllDrivers       from './pages/All-Drivers.js';
import VehicleTracking  from './pages/Vehicle-Tracking.js';
import ScheduleVehicle  from './pages/Schedule-Vehicles.js';
import ScheduleBus      from './pages/Schedule-Bus.js';
import NewVehicle       from './pages/New-Vehicle.js';
import NewDriver        from './pages/New-Driver.js';

import DriverTracking   from './pages/Driver-Tracking.js';
import BusTracking      from './pages/Bus-Tracking.js';

import  { 
  Route, 
  Redirect, 
  BrowserRouter, 
  Switch 
} from 'react-router-dom';
import { ProtectedRoute } from './protected.routes';



function App() {
  return (
    
      <div>

          <BrowserRouter>
                  <Switch>
                    <Route exact path="/auth" component={Login}/>

                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/vehicles" component={AllVehicles}/>
                    <Route exact path="/drivers" component={AllDrivers}/>
                    <Route exact path="/tracking" component={VehicleTracking}/>
                    <Route exact path="/schedules" component={ScheduleVehicle}/>
                    <Route exact path="/schedule-bus" component={ScheduleBus}/>
                    <Route exact path="/add-bus" component={NewVehicle}/>
                    <Route exact path="/add-driver" component={NewDriver}/>

                    <Route exact path="/driver-detail/:id" component={DriverTracking}/>
                    <Route exact path="/vehicle-tracking/:id" component={BusTracking}/>

                    {/* <Route exact path="/driver-details/:id" component={DriverDetails}/>
                    <Route exact path="/driver-rides/:id" component={DriverRides}/>

                    <Route exact path="/rider-details/:id" component={RiderRides}/> */}
                    <Route path='*' exact={true} component={My404Component} />
                  </Switch>
          </BrowserRouter>


      </div>
    
  );
}

export default App;
