<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

<head>
  <?php
    $lang = $_GET['lang'];
    if ($lang == "") {
      $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
      switch ($lang){
        case "fr":
            $lang = "fr";
            break;
        default:
            $lang = "en";
            break;
      }
    }
    if ($lang != "en") {
      $lang = "fr";
    }
  ?>
  <title>Mircea Trandafir</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="../styles/style.css" type="text/css">
  <script> </script><!-- Hack to avoid flash of unstyled content in IE -->
  <script type="text/javascript">
    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
  </script>
  <script type="text/javascript">
    try {
      var pageTracker = _gat._getTracker("UA-5533651-2");
      pageTracker._trackPageview();
    } 
    catch(err) {}
  </script>
</head>

<body>
  <div id="container">
    <div class="wrapper">
      
      <!-- Begin title and navigation menu -->
      <?php include("../nav.php"); ?>
      <!-- End title and navigation menu -->
      
      <div id="main-content">
        <div class="wrapper">
          <table style="border: 0px solid ;" border="0" cellpadding="15" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td valign="top" width="80%">
                  <?php
                    if ($lang == "en") {
                      echo "<h2>Error 404</h2>";
                    } else {
                      echo "<h2>Erreur 404</h2>";
                    }
                  ?>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Begin main content -->
          <?php
            if ($lang == "en") {
              echo "<p>OOPS! Page not found...</p>";
            } else {
              echo "<p>OUPS! La page n'est pas trouvée</p>";
            }
          ?>
          
        </div>
      </div>
      
      <div id="footer">
        <div class="wrapper">
          <p>&nbsp;</p>
          <center>
            <?php
              if ($lang == "en") {
                echo "<em>Last updated: " . strftime( "%A, %B %e, %Y", filemtime("research.php")) . ".</em>";
              } else {
                $jour = array("dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi");
                $mois = array("", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");
                $datemod = filemtime("research.php");
                $datefr = $jour[date("w", $datemod)] . ", " . date("j", $datemod) . " " . $mois[date("n", $datemod)] . " " . date("Y", $datemod); 
                echo "<em>Dernière mise à jour: " . $datefr . ".</em>";
              }
            ?>
          </center>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
