<!-- The layout of this page was inspired by the personal webpage of Ernesto Reuben. 
The navigation menu is a modified version of one constructed using cssmenumaker.com. -->

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-5533651-3', 'auto');
  ga('send', 'pageview');
</script>

<script>
  function gaTrackDownloadableFiles() {
    var links = jQuery('a');
    for(var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('.pdf') != "-1") {
        jQuery(links[i]).attr("onclick", "javascript: _gaq.push(['_trackPageview', '" + links[i].href + "']);");
      }
    }
    return true;
  }
</script>

<script type="text/javascript">
  function new_win(url, tb) {
    toolbar = 'toolbar=no';
    if(tb) toolbar = '';
    newwin = window.open(url, 'name', toolbar);
    if(window.focus) newwin.focus()
    return false;
  }
</script>

<div id="header">
  <div class="wrapper">
    <h1 style="margin: 0pt; margin-bottom: 0.25em;">Mircea Trandafir</h1>
    <?php
      $current_file_name = basename($_SERVER['PHP_SELF']);
      $currentpath = Explode('/', $_SERVER["SCRIPT_NAME"]);
      $path = "";
      for ($i = 1; $i <= count($currentpath) - 2; $i += 1) {
        if ($currentpath[$i] != "mtrandafir") {
          $path = $path . "../";
        }
      }
      echo "<!--<div style=\"float: right; position: relative; top: -1.5em; left: -20px; height: 1em; text-align: right;\">
            <a href=\"" . $current_file_name . "\" target=\"_self\" >" . "</a>
            </div>-->
            <style media=\"all\" type=\"text/css\">@import \"" . $path .  "styles/menu_style.css\";</style>
            <table style=\"border: 0px solid ; background: rgb(246, 247, 251) none repeat scroll 0% 50%; 
            -moz-background-clip: initial; -moz-background-origin: initial; -moz-background-inline-policy: initial; 
            width: 780px; margin-left:10px; margin-right:10px;\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">
              <tbody>
                <tr>
                  <td style=\"text-align: center; padding: 0em;\" width=\"100%\">
                    <div class=\"menu\">
                      <ul>
                        <li><a href=\"" . $path . "index.php\" target=\"_self\" >Home</a></li>
                        <li><a href=\"" . $path . "research.php\" target=\"_self\" >Research</a></li>
                        <li><a href=\"" . $path . "teaching.php\" target=\"_self\" >Teaching</a>
                          <ul>
                            <!--<li><a href=\"" . $path . "enseignement/ecn806/index.php\" target=\"_self\">Économie du
                              travail</a></li>
                            <li><a href=\"" . $path . "enseignement/ecn431/index.php\" target=\"_self\">Analyse
                              coûts-bénéfices</a></li>
                            <li><hr color=\"#445aa9\" width=90%></li>-->
                            <li><a href=\"" . $path . "teaching/econ330/index.php\" target=\"_self\">Money and Banking</a></li>
                            <li><a href=\"" . $path . "teaching/econ435/index.php\" target=\"_self\">Financial Markets</a></li>
                            <li><a href=\"" . $path . "teaching/econ306/index.php\" target=\"_self\">Intermediate Micro</a></li>
                          </ul>
                        </li>
                        <li><a href=\"" . $path . "docs/CV.pdf\" target=\"_new\">CV</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>";
    ?>
  </div>
</div>

