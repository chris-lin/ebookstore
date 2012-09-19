(function(){
  var form = [
    '<form id="form_Catalog" method="post" action="/post">',
    '<input type="text" name="data">',
    '</form>'
  ];

  var app = {};

  var App = function(){};

  App.prototype.init = function(){
    this.bindEvents();
  }

  App.prototype.bindEvents = function(){
    $('.category').bind('click', this.switchCatalog)
    return this;
  }

  App.prototype.switchCatalog = function(e){
    //console.log(this);
    var url = $(this).attr('value');
    var body = $('body');
    body.append(form.join(''));
    $('#form_Catalog > input').val(url);
    $('#form_Catalog').submit();
    return this;
  }

  $(function(){
    app = window.app = new App();
    app.init();
  });

})();



