import React from 'react';
import { Events, EventSchema } from '/imports/api/event/event';
import { Grid, Segment, Header, Form, Checkbox, Button } from 'semantic-ui-react';
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
import { saveAs } from 'file-saver';

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
      repeatOption: false,
      geoLocal: '',
      displayGeoLocal: '',
      priority: '',
    };
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

  createDTSTAMP(date) {
    let dt = `${date.getFullYear()}`;
    dt = dt.concat(("0" + (date.getMonth() + 1)).slice(-2));
    dt = dt.concat(("0" + date.getDate()).slice(-2));
    dt = dt.concat("T");
    dt = dt.concat(("0" + date.getHours()).slice(-2));
    dt = dt.concat(("0" + date.getMinutes()).slice(-2));
    dt = dt.concat("00");
    return dt;
  }

  createTZid(time) {
    const tzos = time.getTimezoneOffset();
    let timezone = '';
    switch (tzos) {
      case 720:
        timezone = 'Pacific/Kiritimati';
        break;
      case 660:
        timezone = 'Etc/GMT+11';
        break;
      case 600:
        timezone = 'Pacific/Honolulu';
        break;
      case 570:
        timezone = 'Pacific/Marquesas';
        break;
      case 540:
        timezone = 'America/Alaska';
        break;
      case 480:
        timezone = 'America/Los_Angeles';
        break;
      case 420:
        timezone = 'America/Phoenix';
        break;
      case 360:
        timezone = 'America/Guatemala';
        break;
      case 300:
        timezone = 'America/Cancun';
        break;
      case 240:
        timezone = 'America/Halifax';
        break;
      case 210:
        timezone = 'America/St_Johns';
        break;
      case 180:
        timezone = 'America/Araguaina';
        break;
      case 120:
        timezone = 'Etc/GMT+2';
        break;
      case 60:
        timezone = 'Atlantic/Azores';
        break;
      case 0:
        timezone = 'Africa/Abidjan';
        break;
      case -60:
        timezone = 'Europe/Berlin';
        break;
      case -120:
        timezone = 'Asia/Amman';
        break;
      case -180:
        timezone = 'Europe/Istanbul';
        break;
      case -210:
        timezone = 'Asia/Tehran';
        break;
      case -240:
        timezone = 'Asia/Dubai';
        break;
      case -270:
        timezone = 'Asia/Kabul';
        break;
      case -300:
        timezone = 'Asia/Tashkent';
        break;
      case -330:
        timezone = 'Asia/Colombo';
        break;
      case -345:
        timezone = 'Asia/Katmandu';
        break;
      case -360:
        timezone = 'Asia/Almaty';
        break;
      case -390:
        timezone = 'Asia/Rangoon';
        break;
      case -420:
        timezone = 'Asia/Bangkok';
        break;
      case -480:
        timezone = 'Asia/Shanghai';
        break;
      case -510:
        timezone ='Asia/Pyongyang';
        break;
      case -540:
        timezone = 'Asia/Tokyo';
        break;
      case -570:
        timezone ='Australia/Adelaide';
        break;
      case -600:
        timezone = 'Australia/Brisbane';
        break;
      case -630:
        timezone = 'Australia/Lord_Howe';
        break;
      case -660:
        timezone = 'Pacific/Bougainville';
        break;
      case -720:
        timezone = 'Asia/Kamchatka';
        break;
      case -765:
        timezone = 'Pacific/Chatham';
        break;
      case -780:
        timezone = 'Etc/GMT-13';
        break;
      case -840:
        timezone = 'Pacific/Kiritimati';
        break;
      default:
        timezone = 'Unknown';
        break;
    }
    return timezone;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      this.setState({ displayGeoLocal: 'Geolocation is not supported by this browser.' });
    }
  }

  showPosition(position) {
    const temp =  'Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude;
    this.setState({ displayGeoLocal: temp });
    this.setState({geoLocal: `${position.coords.longitude};${position.coords.latitude}`});
  }

  /** On submit, insert the data. */
  submit(data) {
    const { title, location, startDate, endDate, priority, classification,
      version, repeat, numOfEvents, description, resources, guests } = data;
    const owner = Meteor.user().username;
    console.log(version);
    console.log(this.state.priority);
    navigator.geolocation.getCurrentPosition((position) => 	    
    this.setState({geoLocal: `${position.coords.longitude};${position.coords.latitude}`}));	 
    let dataGeoLocal = this.state.geoLocal;
    console.log(startDate);
    console.log(endDate);
    startDate.setTime( startDate.getTime() + startDate.getTimezoneOffset()*60*1000 );
    endDate.setTime( endDate.getTime() + endDate.getTimezoneOffset()*60*1000 );
    const date = new Date();
    const dtStamp = this.createDTSTAMP(date);
    const temp = startDate + ' ';
    let eventFile = `VERSION:${version}.0\r\n`;
    eventFile = eventFile.concat(`CALSCALE:GREGORIAN\r\n`);
    eventFile = eventFile.concat(`BEGIN:VEVENT\r\n`);
    eventFile = eventFile.concat(`DTSTAMP:${this.createDTSTAMP(new Date())}\r\n`);
    eventFile = eventFile.concat(`UID:${dtStamp}-${temp.split(" ")[4].substring(3, 5)}@example.com\r\n`);
    eventFile = eventFile.concat(`LOCATION:${location}\r\n`);
    eventFile = eventFile.concat(`CLASS:${classification}\r\n`);
    eventFile = eventFile.concat(`SUMMARY:${title}\r\n`);
    eventFile = eventFile.concat(`TZID:${this.createTZid(new Date())}\r\n`);
    eventFile = eventFile.concat(`DTSTART:${this.createDTSTAMP(startDate)}\r\n`);
    if (repeat !== 'NONE') {
      eventFile = eventFile.concat(`RRULE:FREQ=${repeat}`);
      if (numOfEvents > 0) {
        eventFile = eventFile.concat(`;COUNT=${numOfEvents}`);
      }
      eventFile = eventFile.concat(`\r\n`);
    }
    eventFile = eventFile.concat(`DTEND:${this.createDTSTAMP(endDate)}\r\n`);
    eventFile = eventFile.concat(`PRIORITY:${priority}\r\n`);
    eventFile = eventFile.concat(`DESCRIPTION:${description}\r\n`);
    eventFile = eventFile.concat(`RESOURCES:${resources}\r\n`);
    // eventFile = eventFile.concat(`GEO:${this.state.geoLocal}\r\n`);
    eventFile = eventFile.concat(`ORGANIZER;CN=${owner}:mailto:${owner}\r\n`);
    eventFile = eventFile.concat(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=FALSE;CN=${guests};X-NUM-GUESTS=0:mailto:${guests}\r\n`);
    eventFile = eventFile.concat(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE;CN=${owner};X-NUM-GUESTS=0:mailto:${owner}\r\n`);

    console.log(`BEGIN:VCALENDAR\r\n${eventFile}STATUS:CONFIRMED\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`);
    
    let finalFile = `BEGIN:VCALENDAR\r\n${eventFile}STATUS:CONFIRMED\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
    let blobFile = new Blob([finalFile], {type: 'text/plain;charset=utf-8'});
    saveAs(blobFile, `${title}.ics`);

    Events.insert({ title, location, startDate, endDate, dataGeoLocal, priority,
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
                <TextField name='guests' placeholder="When inseting guests place a comma after each guest's emails"/>
                <TextField name='location'/>
                <DateField name='startDate'/>
                <DateField name='endDate'/>
                <TextField name='description'/>
               <Checkbox toggle label='Show Repeats'
                onChange={() => this.state.repeatOption ? this.setState({repeatOption: false}) :  this.setState({repeatOption: true})}/>
                {this.state.repeatOption && <SelectField name='repeat' label="Repeat" default="NONE" />}
                {this.state.repeatOption && <NumField name='numOfEvents' label="Number of times per repeat" min='0' default="0" decimal={false} />}
                <SelectField name='priority'/>
                <SelectField name='classification'/>
                <SelectField name='version'/>
                <TextField name='resources'/>
                <Button onClick={() => this.getLocation()}>Display Geolocation Coordinates</Button>
                <p>{this.state.displayGeoLocal}</p>
                <SubmitField value='Submit'/>
                <HiddenField name='geoLocal' value='whatever'/>
                <HiddenField name='owner' value='fakeuser@foo.com'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default CreateEvent;
