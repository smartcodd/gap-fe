var socket=io();
socket.on("new imagen",function(data){
    data=JSON.parse(data);
    var container =document.querySelector("#container");
    var source =document.querySelector("#image-template").innerHTML;
    var template=Handlebars.compile(source);
    container.innerHTML+=template(data);
});
socket.on("chat message",function(data){
    console.log(data);
});
