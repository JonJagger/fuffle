
if (Meteor.isClient) {

Template.question.text = function() {
  return Questions.findOne({ qid:this.qid }).text;
};

Template.reveal.answers = function() {
  return Answers.find({ qid:this.qid });
};

}




