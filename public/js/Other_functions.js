$('#bt1').click(function() {
    $('[name=code]').removeAttr('required');
    $('[name=password]').removeAttr('required');
    $('[name="confirm_password"]').removeAttr('required');
    $('form').append('<input type="hidden" name="save" />');
    $('form').submit();
  });