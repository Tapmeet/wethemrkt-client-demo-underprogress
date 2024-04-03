import React, { Component } from 'react';
import { Admin, Resource, AppBar, Layout, Logout, UserMenu } from 'react-admin';
import { Route } from "react-router-dom";
import { AdminDashboard } from './Dashboard'
import { ExitToApp } from './ExitToApp';

const MyLogoutButton = props => <ExitToApp />;

const MyUserMenu = () => <UserMenu><MyLogoutButton /></UserMenu>;

const MyAppBar = () => <AppBar userMenu={<MyUserMenu />} />;

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
class AdminLayout extends Component {
    render() {
        return (
            <Admin layout={MyLayout}>
                <Resource name="dashboard" list={ AdminDashboard } />
                <Resource name="dashboard" list={ AdminDashboard } />
            </Admin>
        );
    }
}
export default AdminLayout;
