<?php
 
 header("Content-Type: application/json");
  
 $data = json_decode(file_get_contents("php://input"));
 $File = "newfile.txt"
 $myfile = fopen("$File", "a") or die("Unable to open file!");
 fwrite($myfile, $data);
 fclose($myfile);
  
 ?>