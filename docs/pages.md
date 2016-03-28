刘松
get / to home#index

server/controller

class Home {
 index(){
   data = get /api
   this.render('home', {
     title: '',
     data : data
   });
 }
}

client/pages/home.jsx

class HomePage {
  render(){
    <Button></Button>
  }
 }


client/page/home.html

<input />
<react />

client/page/home.js

$('input').datepicker = function(){
 alert('hi');
}

client/layout

<html>
<body>
<%= body %>
</body>
</html>