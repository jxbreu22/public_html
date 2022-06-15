<?php
 
 header("Content-Type: application/json");
  
 $data = json_decode(file_get_contents("php://input"));
 $File = "newfile.txt"
 $myfile = fopen("$File", "a") or die("Unable to open file!");
 fwrite($myfile, $data);
 fclose($myfile);
 ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
  
 ?>