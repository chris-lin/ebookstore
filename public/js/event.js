var form = [
  '<form id="form_xml" method="post" action="/post">',
  '<input type="text" name="data">',
  '</form>'
];

$(function(){
  $('.category').bind('click', function(e){
    var url = $(this).attr('value');
    var btn = $(this);
    $.get(url, function(data){
      btn.append(form.join(''));
      console.log(btn.html())
      $('#form_xml > input').val(data);
      $('#form_xml').submit().hide();
      /*
      $.post("/post", {data: data}, function(data) {
         location = "/books";
       });
      */
    }, "html");
  })
})
