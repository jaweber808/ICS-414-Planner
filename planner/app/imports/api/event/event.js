import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Events = new Mongo.Collection('Events');

/** Create a schema to constrain the structure of documents associated with this collection. */
const EventSchema = new SimpleSchema({
  title: String,
  location: String,
  startDate: Date,
  startTime: Date,
  endDate: Date,
  endTime: Date,
  latitude: Number,
  longitude: Number,
  priority: {
    type: Number,
    allowedValues: [0, 9, 1],
    defaultValue: 0,
  },
  classification: {
    type: String,
    allowedValues: ['PUBLIC', 'PRIVATE'],
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
  guests: Array,
  'guests.$': String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Events.attachSchema(EventSchema);

/** Make the collection and schema available to other code. */
export { Events, EventSchema };
