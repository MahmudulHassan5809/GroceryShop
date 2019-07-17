function validateForm() {
  var name =  document.getElementById('name').value;
  var email =  document.getElementById('email').value;
  var subject =  document.getElementById('subject').value;
  var message =  document.getElementById('message').value;
  var status = document.getElementById('status');

  if (name == "") {
      status.className = 'alert alert-danger'
      status.innerHTML = "Name cannot be empty";
      return false;
  }else if (email == "") {
      status.className = 'alert alert-danger'
      status.innerHTML = "Email cannot be empty";
      return false;
  }else{
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(email)){
          status.className = 'alert alert-danger'
          status.innerHTML = "Email format invalid";
          return false;
      }
  }
  if(subject == "") {
      status.className = 'alert alert-danger'
      status.innerHTML = "Subject cannot be empty";
      return false;
  }else if (message == "") {
      status.className = 'alert alert-danger'
      status.innerHTML = "Message cannot be empty";
      return false;
  }else{
     status.classList.remove('alert-danger');
     status.className = 'alert alert-info'
     status.innerHTML = "Sending...";
     submit();
  }

}

function submit(){
  var status = document.getElementById('status');
  formData = {
  'name'     : $('input[name=name]').val(),
  'email'    : $('input[name=email]').val(),
  'subject'  : $('input[name=subject]').val(),
  'message'  : $('textarea[name=message]').val()
  };
  $.ajax({
    url: '/contact',
    type: 'POST',
    data: {formData : formData},
  })
  .done(function() {
    console.log("success");
    $('#contact-form').closest('form').find("input[type=text], textarea").val("");
    status.className = 'alert alert-info'
    status.innerHTML = "Mail Sent SuccessFully...";
  })
  .fail(function() {
    console.log('error');
  })
  .always(function() {
    console.log("complete");
  });

}
