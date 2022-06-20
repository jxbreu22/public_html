const tasks = ["instr_calib", "pr1b", "pr2b", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10",
	"instr", "bp1", "bq1", "bp2", "bq2"];
var mouseControl = false;
var hLock = false;
var hLockCount = 0;
var nextTaskIndex = 0;
var wasdCount = 0;
var paused = 0;
var running = 0;
var startTime, updatedtime, difference, tInterval, savedTime, minutes, seconds, milliseconds;
var timesString = "";
var coordsString = "";
var glassWidth, glassHeight, zoom;
var gazeX, gazeY, mouseX, mouseY;
//Data Collection
var rows = [];
var main = [];
var clicked = false;
window.addEventListener("click", logClick, true);
setInterval(recordCoords, 200);
var base = new Date().getTime();
//setInterval(getCursorPos, 200);
var clicked = false;
var data;
var exp = (window.location.pathname.split("/").pop()) + "; ";
setInterval(leadUp, 40);
var data = [];
function leadUp() {
	time = new Date().getTime();
	var row = "leaduptime_gazex_y, " + time + ", " + gazeX + ", " + gazeY + "; ";
	//	+ ", " + mouseX + ", " + mouseY + "; ";
	data.push(row);
	if (data.length > 6) data.shift();
}
function collectData() {
	for (let i = 0; i < data.length - 1; i++) {
		exp += data[i];
	}
	time = new Date().getTime();
	if (base - time > 500) {
		var row = "Time_gazex_y_mousex_y, " + time + ", " + gazeX + ", " + gazeY + ", " + mouseX + ", " + mouseY + "; ";
		console.log("Clicked: " + clicked + " Time: " + time + " EyeX: " + gazeX + " EyeY: " + gazeY);
		exp += row;
		data = JSON.stringify(exp);
		clicked = false;
	}
	base = new Date().getTime();
}
function recordCoords() {
	var x, y;
	try {
		gazeData = document.getElementById("GazeData").innerHTML.split(" ");
		x = parseFloat(gazeData[0]).toFixed(2);
		y = parseFloat(gazeData[1]).toFixed(2);
		coordsString = '[' + x + ', ' + y + '],';
		gazeX = x;
		gazeY = y;
		//console.log("Gaze: " + coordsString);
	}
	catch (TypeError) {
		//.log(TypeError);
		return;
	}
}
/*
var fso = CreateObject("Scripting.FileSystemObject"); 
var s   = fso.CreateTextFile("../out/test.txt", True);
function writeToText(rows) {
	for (x in rows){
		s.write(x + ", ");
	}
	s.write("/n");
	//s.Close();
}*/
function sendPHP() {
	var data = new FormData();
	for (x in main) {
		data.append(main[i]);
	}
	var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
	xhr.open('post', 'send.php', true);
	xhr.send(data);
}
window.addEventListener("beforeunload", function (e) {
	sendPHP();
});

function logClick() {
	clicked = true;
	collectData();
}
//Export as CSV
function exportCSV() {
	var main = exportMain();
	let csvContent = "data:text/csv;charset=utf-8,";
	main.forEach(function (rowArray) {
		let row = rowArray.join(",");
		csvContent += row + "\r\n";
	});
	var encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
}
function PlotGaze(GazeData) {
	GazeData.state // 0: valid gaze data; -1 : face tracking lost, 1 : gaze uncalibrated
	GazeData.docX // gaze x in document coordinates
	GazeData.docY // gaze y in document cordinates
	GazeData.time // timestamp
	document.getElementById("GazeData").innerHTML = GazeData.docX + " " + GazeData.docY;
	document.getElementById("HeadPhoseData").innerHTML = " HeadX: " + GazeData.HeadX + " HeadY: " + GazeData.HeadY + " HeadZ: " + GazeData.HeadZ;
	document.getElementById("HeadRotData").innerHTML = " Yaw: " + GazeData.HeadYaw + " Pitch: " + GazeData.HeadPitch + " Roll: " + GazeData.HeadRoll;

	var gx = GazeData.docX;
	var gy = GazeData.docY;

	gazeX = gx;
	gazeY = gy;

	var gaze = document.getElementById("gaze");
	gx -= gaze.clientWidth / 2;
	gy -= gaze.clientHeight / 2;
	gaze.style.left = gx + "px";
	gaze.style.top = gy + "px";

	(gaze.style.display == 'block');
	//console.log("GAZE: " + GazeData.docX + " " + GazeData.docY);
}

function magnify(imgID) {
	window.setInterval(moveToGazeCoords, 200);
	/* *************************** CHANGE DEFAULT ZOOM LEVEL HERE *********************************/
	//var zoom;// = 4;
	/* **********************************************************************************************/
	var img, glass, w, h, bw;
	img = document.getElementById(imgID);
	/*create magnifier glass:*/
	glass = document.createElement("DIV");
	glass.setAttribute("class", "img-magnifier-glass");
	if (zoom === undefined) zoom = 1;
	if (glassHeight === undefined) glassHeight = 0;
	if (glassWidth === undefined) glassWidth = 0;
	glass.style.height = glassHeight + "px";
	glass.style.width = glassWidth + "px";
	/*insert magnifier glass:*/
	img.parentElement.insertBefore(glass, img);
	/*set background properties for the magnifier glass:*/
	glass.style.backgroundImage = "url('" + img.src + "')";
	glass.style.backgroundRepeat = "no-repeat";
	glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
	bw = 3;
	w = glass.offsetWidth / 2;
	h = glass.offsetHeight / 2;
	/* Move the mag to mouse (when mouseControl is true):*/
	//glass.addEventListener("mousemove", moveToMouse);
	//img.addEventListener("mousemove", moveToMouse);
	/* handle keypresses */
	//document.addEventListener("keydown", keyControl);
	//document.addEventListener("keyup", checkShiftUp);
	// check click for button
	glass.addEventListener("click", checkClick, false);
	img.addEventListener("click", checkClick, false);
	/* move magnifier towards gaze coordinates */
	//setInterval(moveToGazeCoords, 30);

	function checkClick(e) {
		var pos, x, y;
		pos = getCursorPos(e);
		x = pos.x;
		y = pos.y;
		//console.log(`Mouse X: ${x}, Mouse Y: ${y}`);
		logClick();
		if ((x > btnCoords.x_lower) && (x < btnCoords.x_upper) && (y > btnCoords.y_lower) && (y < btnCoords.y_upper)) {
			download(data, 'mag.json', 'application/json');
			window.location.href = nextPage;
		}
	}
	function download(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([content], { type: contentType });
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}

	function recordCoords() {
		var x, y;
		try {
			gazeData = document.getElementById("GazeData").innerHTML.split(" ");
			x = parseFloat(gazeData[0]).toFixed(2);
			y = parseFloat(gazeData[1]).toFixed(2);
			coordsString = '[' + x + ', ' + y + '],';
			gazeX = x;
			gazeY = y;
			//console.log("Gaze: " + coordsString);
		}
		catch (TypeError) {
			//.log(TypeError);
			return;
		}
	}
	function getCursorPos(e) {
		var a, x = 0, y = 0;
		e = e || window.event;
		/*get the x and y positions of the image:*/
		a = img.getBoundingClientRect();
		/*calculate the cursor's x and y coordinates, relative to the image:*/
		x = e.pageX - a.left;
		y = e.pageY - a.top;
		/*consider any page scrolling:*/
		x = x - window.pageXOffset;
		y = y - window.pageYOffset;
		mouseX = x;
		mouseY = y;
		return { x: x, y: y };
	}
	var x, y;
	var px, py;
	px = py = 0;
	// Image of cursor
	var cursor = document.getElementById("cursor");
	//Move the magnifying glass based on the coordinates in GazeData 
	function moveToGazeCoords() {
		//var x, y, left_old, left_new, top_old, top_new, incr;
		incr = 7;
		try {
			gazeData = document.getElementById("GazeData").innerHTML.split(" ");
		}
		catch (TypeError) {
			console.log(TypeError)
			return;
		}
		x = parseFloat(gazeData[0]);
		y = parseFloat(gazeData[1]);
		PlotGaze;
	}

	/* mutex is used to avoid multiple click event from
	   firing at the same time due to different position
	   of image cursor and actual cursor 
	   Using mutex avoid any conflicts if original cursor and
	   image cursor are both on a clickable element
	   This makes sure only 1 click event is triggered at a time*/

	var mutex = false;

	/*
	 The following event is selecting the element
	 on the image cursor and fires click() on it.
	 The following event is triggered only when mouse is pressed.
	 */
	window.addEventListener("keydown", keyControl);
	function keyControl(e) {
		try {
			switch (e.code) {
				case ("KeyB"):
					// gets the object on image cursor position
					var tmp = document.elementFromPoint(x + px, y + py);
					mutex = true;
					tmp.click();
					cursor.style.left = (px + x) + "px";
					cursor.style.top = (py + y) + "px";
			}
		}
		catch (TypeError) {
			return;
		}
	}

	/* The following event listener moves the image pointer 
	 with respect to the actual mouse cursor
	 The function is triggered every time mouse is moved */
	window.addEventListener("mousemove", function (e) {

		// Gets the x,y position of the mouse cursor
		x = e.clientX;
		y = e.clientY;

		// sets the image cursor to new relative position
		cursor.style.left = (px + x) + "px";
		cursor.style.top = (py + y) + "px";

	});
	setInterval(gmUpdate, 5);
	function gmUpdate() {
		x = gazeX;
		y = gazeY;
		cursor.style.left = (px + x) + "px";
		cursor.style.top = (py + y) + "px";
	}
	/*
	//console.log("GazeX: " + x + ", GazeY: " + y);
	//prevent the magnifier glass from being positioned outside the image:
	if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
	if (x < w / zoom) { x = w / zoom; }
	if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
	if (y < h / zoom) { y = h / zoom; }
	//move the glass towards the gaze coordinates
	left_old = parseInt(glass.style.left.slice(0, -2));
	left_new = left_old;
	top_old = parseInt(glass.style.top.slice(0, -2));
	top_new = top_old;
	//console.log(`Gaze Y: ${y}, top of mag: ${top_old}`);

	if (x < (left_old + 0.5 * w)) { // move the glass left
		left_new -= incr;
		glass.style.left = (left_new) + "px";
	}
	else if (x > (left_old + 1.5 * w)) { // move the glass right
		left_new += incr;
		glass.style.left = (left_new) + "px";
	}

	if ((!hLock) && (y < (top_old + 0.5 * h))) { // move the glass up
		top_new -= incr;
		glass.style.top = (top_new) + "px";
	}
	else if ((!hLock) && (y > (top_old + 1.5 * h))) { // move the glass down
		top_new += incr;
		glass.style.top = (top_new) + "px";
	}

	x = left_new + w;
	y = top_new + h;

	old code to directly set the position of the magnifier glass:
	//glass.style.left = (x - w) + "px";
	//glass.style.top = (y - h) + "px";

	//display what the magnifier glass "sees":
	glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";

}*/
}
function startTimer() {
	if (!running) {
		startTime = new Date().getTime();
		tInterval = setInterval(getShowTime, 1);
		paused = 0;
		running = 1;
		setInterval(collectData(), 30);
	}
}

function pauseTimer() {
	if (!difference) { }
	else if (!paused) {
		clearInterval(tInterval);
		savedTime = difference;
		if (nextTaskIndex > 0) {
			newTimesString = tasks[nextTaskIndex - 1] + ": " +
				`${minutes}:${seconds}:${milliseconds}` + ",";
			timesString += newTimesString;
			coordsString += newTimesString;
		}
		paused = 1;
		console.log(`${minutes}:${seconds}:${milliseconds}`);
		running = 0;
	} else {
		startTimer();
	}
}

function resetTimer() {
	clearInterval(tInterval);
	savedTime = 0;
	difference = 0;
	paused = 0;
	running = 0;
}

function getShowTime() {
	updatedTime = new Date().getTime();
	if (savedTime) {
		difference = (updatedTime - startTime) + savedTime;
	} else {
		difference = updatedTime - startTime;
	}
	minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	seconds = Math.floor((difference % (1000 * 60)) / 1000);
	milliseconds = Math.floor((difference % (1000 * 60)) / 100);

	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
}
