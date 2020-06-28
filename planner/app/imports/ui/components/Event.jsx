import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';


/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Contact extends React.Component {
  render() {
    return (
        <Card centered>
          <Card.Content>
            <Card.Header>{this.props.event.title}</Card.Header>
            <Card.Meta>
                {this.props.event.guests}
                {this.props.event.startDate} {this.props.event.startTime}
                {this.props.event.endDate} {this.props.event.endTime}            
            </Card.Meta>
            <Card.Description>
                {this.props.event.description}
                {this.props.event.location}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/edit/${this.props.event._id}`}>Edit</Link>
          </Card.Content>
        </Card>
    );
  }
}
/** Require a document to be passed to this component. */
Contact.propTypes = {
  contact: PropTypes.object.isRequired
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);