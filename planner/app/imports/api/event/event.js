import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Events = new Mongo.Collection('Events');

/** Create a schema to constrain the structure of documents associated with this collection. */
const EventSchema = new SimpleSchema({
  title: String,
  location: String,
  startDate: {
    type: Date,
    custom() {
      if(this.value < new Date()) {
        return SimpleSchema.ErrorTypes.BAD_DATE;
      }
    }
  },
  endDate: {
    type: Date,
    custom() {
      if(this.value <= this.field('startDate').value) {
        return SimpleSchema.ErrorTypes.BAD_DATE;
      }
    }
  },
  geoLocal: String,
  priority: {
    type: Number,
    allowedValues: [0, 9, 1],
    defaultValue: 0,
  },
  classification: {
    type: String,
    allowedValues: ['PUBLIC', 'PRIVATE', 'CONFIDENTIAL'],
    defaultValue: 'PUBLIC',
  },
  version: {
    type: Number,
    allowedValues: [1.0, 2.0],
    defaultValue: 1.0,
  },
  repeat: {
    type: String,
    allowedValues: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    defaultValue: 'NONE',
  },
  numOfEvents: Number,
  description: String,
  resources: String,
  owner: String,
  guests: String,
  guestEmails: Array,
  'guestEmails.$': {
    type: String,
    // regEx: SimpleSchema.RegEx.EmailWithTLD,
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Events.attachSchema(EventSchema);

/** Make the collection and schema available to other code. */
export { Events, EventSchema };
