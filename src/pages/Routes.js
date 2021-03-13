import React from 'react';
import auth from '../auth';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './../components/Header.js';
import Footer from './../components/Footer.js';
import Dashboard from './Dashboard.js';
import AllVehicles from './All-Vehicles.js';

import My404Component from './404';
import Login from './Login';



export const Routes = props => {

    return(
        <div>

        
          <BrowserRouter>
            {/* <Header/>  */}
              <Switch>
                <Route exact path="/dash" component={Dashboard}/>
                <Route exact path="/vehicles" component={AllVehicles}/>

              </Switch>
            <Footer/>
          </BrowserRouter>


        </div>
        )
};