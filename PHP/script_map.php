<?php
session_start();
header("Content-Type: text/xml");
include("laby.inc");
echo '<?xml version="1.0"?>';
	echo "<elementracine>";
		if(isset($_SESSION["pid"]) && isset($_SESSION["x"]) && is_numeric($_SESSION["x"]) && isset($_SESSION["y"]) && is_numeric($_SESSION["y"]) && isset($_SESSION["z"]) && is_numeric($_SESSION["z"]) && isset($_SESSION["dir"]) && is_numeric($_SESSION["dir"])){
			$z=$_SESSION["z"];
			$dir=$_SESSION["dir"];
			echo "<p>1</p>";
			switch($dir){
				case 0:
					for($i=$_SESSION["x"]-3;$i<=$_SESSION["x"];$i++){
						echo "<p>";
						for($j=$_SESSION["y"]-3;$j<=$_SESSION["y"]+3;$j++){
							if(isset($laby[$z][$i][$j])){
								echo $laby[$z][$i][$j];
							}else{
								echo 0;
							}
						}
						echo "</p>";
					}
					break;
				case 1:
					for($i=$_SESSION["y"]+3;$i>=$_SESSION["y"];$i--){
						echo "<p>";
						for($j=$_SESSION["x"]-3;$j<=$_SESSION["x"]+3;$j++){
							if(isset($laby[$z][$j][$i])){
								echo $laby[$z][$j][$i];
							}else{
								echo 0;
							}
						}
						echo "</p>";
					}
					break;
				case 2:
					for($i=$_SESSION["x"]+3;$i>=$_SESSION["x"];$i--){
						echo "<p>";
						for($j=$_SESSION["y"]-3;$j<=$_SESSION["y"]+3;$j++){
							if(isset($laby[$z][$i][$j])){
								echo $laby[$z][$i][$j];
							}else{
								echo 0;
							}
						}
						echo "</p>";
					}
					break;
				case 3:
					for($i=$_SESSION["y"]-3;$i<=$_SESSION["y"];$i++){
						echo "<p>";
						for($j=$_SESSION["x"]+3;$j>=$_SESSION["x"]-3;$j--){
							if(isset($laby[$z][$j][$i])){
								echo $laby[$z][$j][$i];
							}else{
								echo 0;
							}
						}
						echo "</p>";
					}
					break;
			}
			echo "<p>".$_SESSION["x"].",".$_SESSION["y"].",".$_SESSION["z"].",".$_SESSION["dir"]."</p>";
		}else{
			echo "<p>0</p>";
		}
	echo "</elementracine>";
?>