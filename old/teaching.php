<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

<head>
  <title>Mircea Trandafir - Teaching</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="styles/style.css" type="text/css">
  <script> </script><!-- Hack to avoid flash of unstyled content in IE -->
</head>

<body>
  <div id="container">
    <div class="wrapper">
      
      <!-- Begin title and navigation menu -->
      <?php include("nav.php"); ?>
      <!-- End title and navigation menu -->
      
      <div id="main-content">
        <div class="wrapper">
          <table style="border: 0px solid ;" border="0" cellpadding="15" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td valign="top" width="80%">
                  <h2>Teaching</h2>
                </td>
              </tr>
            </tbody>
          </table>
          
          <p>On this page you can find some materials related to courses I taught in the past.</p>
          
          <!-- Begin main content -->

          <h3>Previously-taught courses</h3>
          
          <p><a href="teaching/econ330/index.php">Econ330 - Money and Banking</a> (University of Maryland, undergraduate)</p>
          <p><a href="teaching/econ435/index.php">Econ435 - Financial Markets and the Macroeconomy</a> (University of Maryland, undergraduate)</p>
          <p><a href="teaching/econ306/index.php">Econ306 - Intermediate Microeconomic Theory</a> (University of Maryland, undergraduate)</p>
          
          <!-- End main content -->
          
        </div>
        
      <p>&nbsp;</p>
    </div>
  </div>
  <div id="footer">
    <div class="wrapper">
      <p>&nbsp;</p>
        <center>
          <?php
            echo "<em>Last updated: " . strftime( "%A, %B %e, %Y", filemtime("teaching.php")) . ".</em>";
          ?> 
        </center>
      </div>
    </div>
  </div>
</body>

</html>

