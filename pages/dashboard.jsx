// index page that next.js will use
import React from 'react';
import { ThemeProvider, Arwes, createTheme } from 'arwes';
import './static/index.css';
import { LoggedInHeaderComponent } from './components/header/component';
import { useLoaded, isLoggedIn } from '../util';

const theme = createTheme();

const Dashboard = () => {
    const loaded = useLoaded();
    return (
        <>
            {loaded && (
                <ThemeProvider theme={theme}>
                    <Arwes animate background="/dashboard_back.jpeg">
                        <div>
                            <LoggedInHeaderComponent />
                        </div>
                    </Arwes>
                </ThemeProvider>
            )}
        </>
    );
};

Dashboard.getInitialProps = async ({ req, res }) => {
    isLoggedIn(req, res);
    return {};
};

export default Dashboard;
