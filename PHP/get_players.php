<?php
header("Content-Type: text/xml");
session_start();
$dbh=new PDO("");
echo '<?xml version="1.0"?>';
	echo "<elementracine>";
	if(isset($_SESSION["pid"]) && isset($_SESSION["x"]) && is_numeric($_SESSION["x"]) && isset($_SESSION["y"]) && is_numeric($_SESSION["y"]) && isset($_SESSION["z"]) && is_numeric($_SESSION["z"]) && isset($_SESSION["dir"]) && is_numeric($_SESSION["dir"])){
		echo "<p>1</p>";
		$stm=$dbh->prepare("SELECT pid,login FROM players WHERE pid<>?");
		$stm->execute(array($_SESSION["pid"]));
		while($res=$stm->fetch()){
			echo "<p>".$res["login"]."</p>";
		}
	}else{
		echo "<p>0</p>";
	}	
echo "</elementracine>";
?>