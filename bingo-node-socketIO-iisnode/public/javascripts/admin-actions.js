$(function () {
    var socket        = io();
    $(document).on("click", "a", function() {
    if (confirm('Are you sure you want to restart the server')) {
		socket.emit("end server")    }
	});

});