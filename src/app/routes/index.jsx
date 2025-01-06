import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ContentArea from '../admin/dashboard/setting/contentarea';
import AdminLogin from '../admin/login/page';
import AdminDashboard from '../admin/dashboard/page';
import AdminDashboardSettings from '../admin/dashboard/setting/page';

const Routes = () => {
    return (
        <Router>
            <Switch>
                {/* <Route path="/dashboard" element={ContentArea} />, */}
                <Route path="/admin/login" element={AdminLogin} />,
                <Route path="/admin/dashboard" element={AdminDashboard}
                 children={[
                    <Route path="/admin/login" element={AdminLogin} />,
                 ]}/>
                <Route path="/admin/dashboard/settings" element={AdminDashboardSettings} />
                {/* Add more routes here as needed */}
            </Switch>
        </Router>
    );
};

export default Routes;
