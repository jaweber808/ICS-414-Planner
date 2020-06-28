import React from 'react';
import { Events, EventSchema } from '/imports/api/event/event';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import DateField from 'uniforms-semantic/DateField';
import SelectField from 'uniforms-semantic/SelectField';
import BoolField from 'uniforms-semantic/BoolField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

/** Renders the Page for adding a document. */
class CreateEvent extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.formRef = null;
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Add succeeded' });
      this.formRef.reset();
    }
  }

  /** On submit, insert the data. */
  submit(data) {
    const { title, location, startDate, startTime, endDate, endTime, latitude, longitude, priority, classification,
      version, repeat, numOfEvents, description, resources, guests } = data;
    const owner = Meteor.user().username;
    Events.insert({ title, location, startDate, startTime, endDate, endTime, latitude, longitude, priority,
      classification, version, repeat, numOfEvents, description, resources, owner, guests }, this.insertCallback);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Create Event</Header>
            <AutoForm ref={(ref) => { this.formRef = ref; }} schema={EventSchema} onSubmit={this.submit}>
              <Segment>
                <TextField name='title'/>
                <TextField name='location'/>
                <DateField name='startDate'/>
                <TextField name='startTime'/>
                <DateField name='endDate'/>
                <TextField name='endTime'/>
                <TextField name='description'/>
                <BoolField name='repeat'/>
                <TextField name='guests'/>
                <HiddenField name='latitude'/>
                <HiddenField name='longitude'/>
                <SelectField name='priority'/>
                <SelectField name='classification'/>
                <SelectField name='version'/>
                <TextField name='resources'/>
                <HiddenField name='owner'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default CreateEvent;
