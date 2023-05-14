$(document).ready(function() {
    $('form').on('submit', function(event) {
      event.preventDefault();
  
      var cppCode = $('textarea[name="cpp_code"]').val();
  
      $.post('/generate', { cpp_code: cppCode }, function(response) {
        $('#intermediate-code').html(response);
      });
    });
  });
  