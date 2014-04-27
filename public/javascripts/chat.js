
io.on('connect', function() {
    $nameContainer = $("#nameContainer");
    $nameContainer.show();
    $name = $("#name");
    $name.focus();
    var name;
    $name.keypress(function(e) {
        if (e.which == 13){
            $(this).blur();
            $("#submitName").click();
            $("#data").focus();
        }
    });
    $("#submitName").click(function() {
        name = $name.val();
        io.emit('adduser', name);
        $nameContainer.hide();
        $("#data").show().focus();
        $("#send").show();
      });
   
});

io.on('updatechat', function(username, data) {
    if(username === ''){
        $("#chat").append(data+'<br>');
    }
    else{
        if(data !== ''){
            $("#chat").append('<b>'+username+':</b> '+data+'<br>');
        }
    }
});

$(function() {
    $("#send").click( function() {
        var message = $("#data").val();
        $("#data").val('');
        io.emit('sendchat', message);
    });

    $("#data").keypress(function(e) {
        if (e.which == 13){
            $(this).blur();
            $("#send").click();
            $("#data").focus();
        }
    });
});