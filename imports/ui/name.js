import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { addName } from '../api/name.js';
import './name.html';


Template.name.onCreated(function nameOnCreated() {
  this.amChanging = new ReactiveVar(false);
});

Template.name.helpers({
  hasName() {
    return Meteor.user().name !== undefined;
  },
  amChanging() {
    return Template.amChanging.get();
  }
});

Template.name.events({
  'click .namesubmit'(event, instance) {
    addName.call({
      name: event.target.text.value
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  },
  'click .changename'(event, instance) {
    instance.amChanging.set(true);
  }
    
});

