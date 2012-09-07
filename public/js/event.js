
$(function(){
  $('.category').bind('click', function(e){
    var url = $(this).attr('value');
    $.get(url, function(data){
      $.post("/post", {data: data}, function(data) {
         location = "/books";
       });
    }, "html");
  })
})
