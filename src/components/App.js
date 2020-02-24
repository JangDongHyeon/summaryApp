import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Header from './Haeder';
import Summary from './summary';

import './App.scss';

class App extends React.Component {
    useStyles() {
        makeStyles(theme => ({
            root: { flexGrow: 1 },
            session: { paddingTop: 5 }
        }));
    }

    render() {
        return (
            <div className="htmlcontainer">
                <Grid container spacing={0} className={this.useStyles.root}>
                    <Grid item xs={12} className={this.useStyles.session} className="headercontainer">
                        <Header />
                    </Grid>

                    <Grid item xs={12} className={this.useStyles.session} className="footercontainer">
                        <Summary />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default App;
