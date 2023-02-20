function MM_swapImgRestore() { //v3.0
  var i, x, a = document.MM_sr; 
  for(i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) 
  x.src = x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d = document; 
  if(d.images){
    if(!d.MM_p) d.MM_p = new Array();
    var i, j = d.MM_p.length, a = MM_preloadImages.arguments;
    for(i = 0; i < a.length; i++)
    if(a[i].indexOf("#") != 0){
      d.MM_p[j] = new Image; 
      d.MM_p[j++].src=a[i];
    }
  }
}

function MM_findObj(n, d) { //v4.0
  var p, i, x;
  if(!d) d = document; 
  if((p = n.indexOf("?")) > 0 && parent.frames.length) {
    d = parent.frames[n.substring(p + 1)].document;
    n = n.substring(0, p);
  }
  if(!(x = d[n]) && d.all) x = d.all[n];
  for(i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
  for(i=0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
  if(!x && document.getElementById) x = document.getElementById(n);
  return x;
}

function MM_swapImage() { //v3.0
  var i, j = 0, x, a = MM_swapImage.arguments;
  document.MM_sr = new Array;
  for(i = 0; i < (a.length - 2); i += 3)
    if((x = MM_findObj(a[i])) != null) {
      document.MM_sr[j++] = x;
      if(!x.oSrc) x.oSrc = x.src;
      x.src = a[i+2];
    }
}

function DisplayLastUpdated() {
  var days = new Array(8);
    days[1] = "Sunday";
    days[2] = "Monday";
    days[3] = "Tuesday";
    days[4] = "Wednesday";
    days[5] = "Thursday";
    days[6] = "Friday";
    days[7] = "Saturday";
  var months = new Array(13);
    months[1] = "January";
    months[2] = "February";
    months[3] = "March";
    months[4] = "April";
    months[5] = "May";
    months[6] = "June";
    months[7] = "July";
    months[8] = "August";
    months[9] = "September";
    months[10] = "October";
    months[11] = "November";
    months[12] = "December";
  var dateObj = new Date(document.lastModified);
  var wday = days[dateObj.getDay() + 1];
  var lmonth = months[dateObj.getMonth() + 1];
  var date = dateObj.getDate();
  var fyear = dateObj.getYear();
  if (fyear < 2000) fyear = fyear + 1900;
  document.write("<i>Last updated: " + wday + ", " + lmonth + " " + date + ", " + fyear + "</i>");
}