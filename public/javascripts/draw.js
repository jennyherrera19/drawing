/**
 * Created by jenniferherrera on 4/15/14.
 */

var paths = {};
var sessionId = io.socket.sessionid;

//random color generator and random opacity
function randomColor() {
    return Math.random()
}

function randomOpacity() {
    return (Math.random() * 0.25) + 0.05;
}

var color= {
  "red": randomColor(),
  "green": randomColor(),
  "blue": randomColor(),
  "opacity": randomOpacity()
};
var path;
var color;
function onMouseDown(event) {
    /*path = new Path();
    path.strokeColor = 'yellow';
    path.add(event.point);*/
    color = $("#colorPicker").spectrum("get").toString();
    var point = event.point;
    var data = {
        point: point,
        color: color
    }
    startPath(data, sessionId);
    emit("startPath", data, sessionId);
}

tool1 = new Tool();
tool1.onMouseDown = onMouseDown;

tool1.onMouseDrag = function(event) {
    var point = event.point;
    //path.add(event.point);
    //data.tool = 'tool1';
    var data = {
        point: point,
        tool: "tool1"
    };
    continuePath(data, sessionId);
    emit("continuePath",data, sessionId);
}

tool2 = new Tool();
tool2.minDistance = 50;
tool2.onMouseDown = onMouseDown;

tool2.onMouseDrag = function(event) {
    var point = event.point;
    var data = {
        point: point,
        tool: "tool2"
    };
    continuePath(data, sessionId);
    emit("continuePath",data, sessionId);

}

tool3 = new Tool();
tool3.maxDistance = 50;
tool3.onMouseDown = onMouseDown;
tool3.onMouseDrag = function(event) {

    var radius = event.delta.length / 2;
    var circle = new Path.Circle(event.middlePoint, radius);
    color = $("#colorPicker").spectrum("get").toString();
    var data = {
        radius: radius,
        circle: circle,
        color: color,
        tool: "tool3"
    }
    //circle.fillColor = randomColor();
    continuePath(data, sessionId);
    emit("continuePath",data, sessionId);

}

tool4 = new Tool();
tool4.onMouseDown = onMouseDown;

tool4.onMouseUp = function(event) {
    var point = event.point;
    //path.add(event.point);
    //data.tool = 'tool1';
    var data = {
        point: point,
        tool: "tool4"
    };
    continuePath(data, sessionId);
    emit("continuePath",data, sessionId);
}

/*****************************
 * Drawing Functions
 ******************************/

function startPath(data, sessionId) {
    paths[sessionId] = new Path();
    paths[sessionId].strokeColor = data.color;
    paths[sessionId].add(data.point);
}

function continuePath(data, sessionId) {
    var path = paths[sessionId];
    if (data.tool === "tool1"){
        path.add(data.point);
    }
    else if (data.tool === "tool2"){
        path.arcTo(data.point);
    }
    else if (data.tool === "tool3"){
        data.circle.fillColor = data.color;
    }
    else if (data.tool === "tool4"){
        path.add(data.point);
    }
}

function emit(eventName, data, sessionId) {
    io.emit(eventName, data, sessionId);
}

function arrToJ(arr){
    return new Point(arr[1],arr[2]);
}

function arrto(arr) {
    return new Path(arr[1]);
}

io.on('startPath', function(data, sessionId) {
    if (data.point){
        data.point = arrToJ(data.point);
    }
    else if (data.circle){
        data.circle = arrto(data.circle);
    }
    startPath(data, sessionId);
});

io.on('continuePath', function(data, sessionId) {
    if (data.point){
        data.point = arrToJ(data.point);
    }
    else if (data.circle){
        data.circle = arrto(data.circle);
    }
   continuePath(data, sessionId);
    view.draw();
});