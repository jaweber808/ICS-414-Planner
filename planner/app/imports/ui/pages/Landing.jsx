import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={4}>
            <Icon size='massive' name="calendar alternate"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Event File Creator</h1>
            <p>Provides a form to create an .ics file to be used in Google Calendar to generate events.</p>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
