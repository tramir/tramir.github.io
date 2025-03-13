function isempty(obj) {
  if (obj == null) {
    return true;
  } else {
    if (obj.textContent == "") {
      return true;
    } else {
      return false;
    }
  }
}
function fill_in_text() {
  if (window.XMLHttpRequest)
  {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
   {
     // code for IE6, IE5
     xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
  xmlhttp.open("GET","assets/xml/research.xml", false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;

  // Publications

  text = '<h3>Publications</h3> <hr class="divider-w mt-10 mb-20">';
  papers=xmlDoc.getElementsByTagName("pub");
  for (i = 0; i < papers.length; i++) {
    text += '<div class="panel-heading"><h4 class="panel-title">'
        + '<a data-toggle="collapse" class="collapsed" href="#'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><strong>'
        + papers[i].getElementsByTagName("title")[0].textContent
        + '</strong>'
        + (isempty(papers[i].getElementsByTagName("coauthors")[0]) ? '.' :
            (' (with ' + papers[i].getElementsByTagName("coauthors")[0].textContent + ').'))
        + (isempty(papers[i].getElementsByTagName("coauthors")[0]) ? '' :
            (' <strong><em>' + papers[i].getElementsByTagName("journal")[0].textContent + '</em></strong> '))
        + (isempty(papers[i].getElementsByTagName("vol_issue")[0]) ? '' :
            (papers[i].getElementsByTagName("vol_issue")[0].textContent))
        + (isempty(papers[i].getElementsByTagName("date")[0]) ? '' :
            (' (' + papers[i].getElementsByTagName("date")[0].textContent + ')'))
        + (isempty(papers[i].getElementsByTagName("pages")[0]) ? '' :
            (', ' + papers[i].getElementsByTagName("pages")[0].textContent))
        + '. '
        + (isempty(papers[i].getElementsByTagName("notes")[0]) ? ('') :
            (papers[i].getElementsByTagName("notes")[0].textContent + '.'))
        + '</a></h4></div>'
        // + '<div class="row">'
        // + '<div class="col-sm-4"><div style="padding-left:20px"><span class="__dimensions_badge_embed__" data-doi="'
        // + papers[i].getElementsByTagName("doi")[0].textContent 
        // + '" data-style="small_rectangle"></span></div></div>'
        // + '<div class="col-sm-4"><div data-badge-popover="right" data-badge-type="4" data-doi="'
        // + papers[i].getElementsByTagName("doi")[0].textContent 
        // + '" data-hide-no-mentions="true" class="altmetric-embed"></div></div>'
        // + '<div class="col-sm-4 text-center">&nbsp;</div>'
        // + '</div>'
        + '<div class="panel-collapse collapse" id="'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><div class="box"><p>'
        + papers[i].getElementsByTagName("abstract")[0].textContent
        + '</p><div class="row"><div class="col-sm-12"><div class="row">'
        + '<div class="col-sm-2 text-center">&nbsp;</div>'
        + '<div class="col-sm-4 text-center"><button class="btn btn-g btn-circle" '
          + (isempty(papers[i].getElementsByTagName("doc")[0])
            ? 'disabled>'
            : 'onclick="window.open(' + '\'docs/' +  papers[i].getElementsByTagName("doc")[0].textContent
              + '\')"><i class="fa fa-file-text" style="font-size: 1.25em; vertical-align: middle"></i> ')
          + 'Pre-print version</button></div>'
        + '<div class="col-sm-4 text-center"><button class="btn btn-g btn-circle" '
          + (isempty(papers[i].getElementsByTagName("doi")[0])
            ? 'disabled>'
            : 'onclick="window.open(\'https://dx.doi.org/' +  papers[i].getElementsByTagName("doi")[0].textContent
              + '\')"><i class="ai ai-doi" style="font-size: 1.5em; vertical-align: middle"></i> ')
          + 'Printed version</button></div>'
        + '<div class="col-sm-2 text-center">&nbsp;</div>'
        + '</div></div></div></div></div></div>';
  }
  document.getElementById("pubs").innerHTML = text;

  // Working Papers

  text = '<h3>Working Papers</h3> <hr class="divider-w mt-10 mb-20">';
  papers=xmlDoc.getElementsByTagName("wp");
  for (i = 0; i < papers.length; i++) {
    text += '<div class="panel-heading"><h4 class="panel-title">'
        + '<a data-toggle="collapse" class="collapsed" href="#'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><strong>'
        + papers[i].getElementsByTagName("title")[0].textContent
        + '</strong>'
        + (isempty(papers[i].getElementsByTagName("coauthors")[0]) ? '.' :
            (' (with ' + papers[i].getElementsByTagName("coauthors")[0].textContent + ').'))
        + (isempty(papers[i].getElementsByTagName("date")[0]) ? '' :
            (' ' + papers[i].getElementsByTagName("date")[0].textContent))
        + '. '
        + (isempty(papers[i].getElementsByTagName("notes")[0]) ? ('') :
            (papers[i].getElementsByTagName("notes")[0].textContent + '.'))
        + '</a></h4>'
        + '<div class="panel-collapse collapse" id="'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><div class="box"><p>'
        + papers[i].getElementsByTagName("abstract")[0].textContent
        + '</p><div class="row"><div class="col-sm-12"><div class="row">'
        + '<div class="col-sm-4 text-center">&nbsp;</div>'
        + '<div class="col-sm-4 text-center"><button class="btn btn-g btn-circle" '
          + (isempty(papers[i].getElementsByTagName("doc")[0])
            ? 'disabled>'
            : 'onclick="window.open(' + '\'docs/' +  papers[i].getElementsByTagName("doc")[0].textContent
              + '\')"><i class="fa fa-file-text" style="font-size: 1.25em; vertical-align: middle"></i> ')
          + 'Download PDF</button></div>'
        + '<div class="col-sm-4 text-center">&nbsp;</div>'
        + '</div></div></div></div></div></div>';
  }
  document.getElementById("wp").innerHTML = text;

  // Work in Progress

  text = '<h3>Work in Progress</h3> <hr class="divider-w mt-10 mb-20">';
  papers=xmlDoc.getElementsByTagName("wip");
  for (i = 0; i < papers.length; i++) {
    text += '<div class="panel-heading"><h4 class="panel-title"><strong>'
        + papers[i].getElementsByTagName("title")[0].textContent
        + '</strong>'
        + (isempty(papers[i].getElementsByTagName("coauthors")[0]) ? '.' :
            (' (with ' + papers[i].getElementsByTagName("coauthors")[0].textContent + ').'))
        + (isempty(papers[i].getElementsByTagName("notes")[0]) ? ('') :
            (' ' + papers[i].getElementsByTagName("notes")[0].textContent + '.'))
        + '</h4></div>';
  }
  document.getElementById("wip").innerHTML = text;

  // Other Publications

  text = '<h3>Other Publications</h3> <hr class="divider-w mt-10 mb-20">';
  papers=xmlDoc.getElementsByTagName("other_pub");
  for (i = 0; i < papers.length; i++) {
    text += '<div class="panel-heading"><h4 class="panel-title">'
        + '<a data-toggle="collapse" class="collapsed" href="#'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><strong>'
        + papers[i].getElementsByTagName("title")[0].textContent
        + '</strong>'
        + (isempty(papers[i].getElementsByTagName("coauthors")[0]) ? '.' :
            (' (with ' + papers[i].getElementsByTagName("coauthors")[0].textContent + ').'))
        + ' <strong><em>' + papers[i].getElementsByTagName("journal")[0].textContent + '</em></strong> '
        + (isempty(papers[i].getElementsByTagName("vol_issue")[0]) ? '' :
            (papers[i].getElementsByTagName("vol_issue")[0].textContent))
        + (isempty(papers[i].getElementsByTagName("date")[0]) ? '' :
            (' (' + papers[i].getElementsByTagName("date")[0].textContent + ')'))
        + (isempty(papers[i].getElementsByTagName("pages")[0]) ? '' :
            (', ' + papers[i].getElementsByTagName("pages")[0].textContent))
        + '. '
        + (isempty(papers[i].getElementsByTagName("notes")[0]) ? ('') :
            (papers[i].getElementsByTagName("notes")[0].textContent + '.'))
        + '</a></h4>'
        + '<div class="panel-collapse collapse" id="'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><div class="box"><p>'
        + papers[i].getElementsByTagName("abstract")[0].textContent
        + '</p><div class="row"><div class="col-sm-12"><div class="row">'
        + '<div class="col-sm-2 text-center">&nbsp;</div>'
        + '<div class="col-sm-4 text-center"><button class="btn btn-g btn-circle" '
          + (isempty(papers[i].getElementsByTagName("doc")[0])
            ? 'disabled>'
            : 'onclick="window.open(' + '\'docs/' +  papers[i].getElementsByTagName("doc")[0].textContent
              + '\')"><i class="fa fa-file-text" style="font-size: 1.25em; vertical-align: middle"></i> ')
          + 'Pre-print version</button></div>'
        + '<div class="col-sm-4 text-center"><button class="btn btn-g btn-circle" '
          + (isempty(papers[i].getElementsByTagName("doi")[0])
            ? 'disabled>'
            : 'onclick="window.open(\'' +  papers[i].getElementsByTagName("doi")[0].textContent
              + '\')"><i class="ai ai-doi" style="font-size: 1.5em; vertical-align: middle"></i> ')
          + 'Printed version</button></div>'
        + '<div class="col-sm-2 text-center">&nbsp;</div>'
        + '</div></div></div></div></div></div>';
  }
  document.getElementById("other_pubs").innerHTML = text;

  // Permanent Working Papers

  text = '<h3>Permanent Working Papers (RIP)</h3> <hr class="divider-w mt-10 mb-20">';
  papers=xmlDoc.getElementsByTagName("rip");
  for (i = 0; i < papers.length; i++) {
    text += '<div class="panel-heading"><h4 class="panel-title">'
        + '<a data-toggle="collapse" class="collapsed" href="#'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><strong>'
        + papers[i].getElementsByTagName("title")[0].textContent
        + '</strong>'
        + (isempty(papers[i].getElementsByTagName("coauthors")[0]) ? '.' :
            (' (with ' + papers[i].getElementsByTagName("coauthors")[0].textContent + ').'))
        + (isempty(papers[i].getElementsByTagName("date")[0]) ? '' :
            (' ' + papers[i].getElementsByTagName("date")[0].textContent))
        + '. '
        + (isempty(papers[i].getElementsByTagName("notes")[0]) ? ('') :
            (papers[i].getElementsByTagName("notes")[0].textContent + '.'))
        + '</a></h4>'
        + '<div class="panel-collapse collapse" id="'
        + papers[i].getElementsByTagName("id")[0].textContent
        + '"><div class="box"><p>'
        + papers[i].getElementsByTagName("abstract")[0].textContent
        + '</p><div class="row"><div class="col-sm-12"><div class="row">'
        + '<div class="col-sm-4 text-center">&nbsp;</div>'
        + '<div class="col-sm-4 text-center"><button class="btn btn-g btn-circle" '
          + (isempty(papers[i].getElementsByTagName("doc")[0])
            ? 'disabled>'
            : 'onclick="window.open(' + '\'docs/' +  papers[i].getElementsByTagName("doc")[0].textContent
              + '\')"><i class="fa fa-file-text" style="font-size: 1.25em; vertical-align: middle"></i> ')
          + 'Download PDF</button></div>'
        + '<div class="col-sm-4 text-center">&nbsp;</div>'
        + '</div></div></div></div></div></div>';
  }
  document.getElementById("rip").innerHTML = text;
}
window.onload = fill_in_text;
