import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import auth from './auth';


const checkAuth = () => {

    const token = localStorage.getItem("token");

    if(!token){
        return false;
    }

}

export const ProtectedRoute = ( { component: Component, ...rest } ) => {

    return (
        <Route 
            {...rest} 
            render={ props => {
                if(checkAuth()){
                    return <Component {...props}/>;
                }
                else {
                    return <Redirect to={
                        {
                            pathname: "/auth",
                            state: {
                                from: props.location  
                            }
                        }
                    }
                    />;
                }
            } }
        />
    );


}