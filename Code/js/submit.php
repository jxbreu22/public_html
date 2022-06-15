<?php
 
 header("Content-Type: application/json");
  
 $data = json_decode(file_get_contents("php://input"));
  
 $myfile = fopen("./newfile.txt", "w") or die("Unable to open file!");
 fwrite($myfile, $data);
 fclose($myfile);
  
 ?>