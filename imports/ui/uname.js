import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { addName } from '../api/uname.js';
import './uname.html';


Template.uname.onCreated(function unameOnCreated() {
  this.amChanging = new ReactiveVar(false);
});

Template.uname.helpers({
  hasName() {
    if (Meteor.user().uname === undefined) {
        return false;
    }
    return true;
  },
  amChanging() {
    return Template.amChanging.get();
  }
});

Template.uname.events({
  'submit .name'(event, instance) {
    event.preventDefault();
    addName.call({
      newName: event.target.name.value
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  },
  'click .changename'(event, instance) {
    event.preventDefault();
    instance.amChanging.set(true);
  }
    
});

