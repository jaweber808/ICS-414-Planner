import React from 'react';
import { Events, EventSchema } from '/imports/api/event/event';
import { Grid, Segment, Header, Form, Checkbox } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import DateField from 'uniforms-semantic/DateField';
import SelectField from 'uniforms-semantic/SelectField';
import NumField from 'uniforms-semantic/NumField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

/** Renders the Page for adding a document. */
const priorityOptions = [
  { key: '0', text: 'None', value: '0' },
  { key: '9', text: 'Low', value: '9' },
  { key: '1', text: 'High', value: '1' },
];
const versionOptions = [
  { key: '1.0', text: 'vCalendar', value: '1.0' },
  { key: '2.0', text: 'iCalendar', value: '2.0' },
];
const repeatOptions = [
  { key: 'NONE', text: 'None', value: 'NONE' },
  { key: 'DAILY', text: 'Daily', value: 'DAILY' },
  { key: 'WEEKLY', text: 'Weekly', value: 'WEEKLY' },
  { key: 'MONTHLY', text: 'Monthly', value: 'MONTHLY' },
  { key: 'YEARLY', text: 'Yearly', value: 'YEARLY' },
];
class CreateEvent extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.formRef = null;
    this.state = {
      repeatOption: false
    }
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
  
  longitudePosition(position) {
    return position.coords.longitude;
  }

  latitudePosition(position) {
    return position.coords.latitude;
  }

  createDTSTAMP (date) {
    let dt = `${date.getFullYear()}`;
    dt = dt.concat(("0" + (date.getMonth() + 1)).slice(-2));
    dt = dt.concat(("0" + date.getDate()).slice(-2));
    dt = dt.concat("T");
    dt = dt.concat(("0" + date.getHours()).slice(-2));
    dt = dt.concat(("0" + date.getMinutes()).slice(-2));
    dt = dt.concat("00");
    return dt;
  }

  /** On submit, insert the data. */
  submit(data) {
    const { title, location, startDate, endDate, priority, classification,
      version, repeat, numOfEvents, description, resources, guests } = data;
    const owner = Meteor.user().username;
    const longitude = navigator.geolocation.getCurrentPosition(this.longitudePosition);
    const latitude = navigator.geolocation.getCurrentPosition(this.latitudePosition);

    let eventFile = `DTSTAMP:${this.createDTSTAMP(new Date())}\r\n`;
    eventFile = eventFile.concat(`UID:placeholder\r\n`);
    eventFile = eventFile.concat(`LOCATION:\r\n`);
    eventFile = eventFile.concat(`CLASS:\r\n`);
    eventFile = eventFile.concat(`SUMMARY:\r\n`);
    eventFile = eventFile.concat(`TZID:\r\n`);
    eventFile = eventFile.concat(`DTSTART: `);
    eventFile = eventFile.concat(`ATTENDEE:\r\n`);
    eventFile = eventFile.concat(`DTEND: `);
    eventFile = eventFile.concat(`PRIORITY:\r\n`);
    eventFile = eventFile.concat(`DESCRIPTION:\r\n`);
    eventFile = eventFile.concat(`RESOURCES:\r\n`);

    console.log(`BEGIN:VEVENT\r\n${eventFile}END:VEVENT\r\n`);

    Events.insert({ title, location, startDate, endDate, latitude, longitude, priority,
      classification, version, repeat, numOfEvents, description, resources, owner, guests }, this.insertCallback);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let repeatOption = false;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Create Event</Header>
            <AutoForm ref={(ref) => { this.formRef = ref; }} schema={EventSchema} onSubmit={this.submit}>
              <Segment>
                <TextField name='title'/>
                <TextField name='guests' placeholder="When inseting guests place a comma after each guest's emails"/>
                <TextField name='location'/>
                <DateField name='startDate'/>
                <DateField name='endDate'/>
                <TextField name='description'/>
               <Checkbox toggle label='Show Repeats' onChange={() => this.state.repeatOption ? this.setState({repeatOption: false}) :  this.setState({repeatOption: true})}/>
                {this.state.repeatOption && <Form.Select name='repeat' options={repeatOptions} label="Repeat" placeholder="None" />}
                {this.state.repeatOption && <NumField name='numOfEvents' label="Number of times per repeat" placeholder="0" decimal={false} />}
                <Form.Select name='priority' options={priorityOptions} label="Priority" placeholder="None" required/>
                <SelectField name='classification'/>
                <Form.Select name='version' options={versionOptions} label="Version" placeholder="vCalendar" required/>
                <TextField name='latitude'/>
                <TextField name='longitude'/>
                <TextField name='resources'/>
                <SubmitField value='Submit'/>
                <HiddenField name='owner'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default CreateEvent;
