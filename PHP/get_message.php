<?php
header("Content-Type: text/xml");
session_start();
include("laby.inc");
$dbh=new PDO("");
echo '<?xml version="1.0"?>';
	echo "<elementracine>";
	if(isset($_SESSION["pid"]) && isset($_SESSION["x"]) && is_numeric($_SESSION["x"]) && isset($_SESSION["y"]) && is_numeric($_SESSION["y"]) && isset($_SESSION["z"]) && is_numeric($_SESSION["z"]) && isset($_SESSION["dir"]) && is_numeric($_SESSION["dir"])){
		echo "<p>1</p>";
		$stm=$dbh->prepare("SELECT mid FROM msgto WHERE msgto=?");
		$stm->execute(array($_SESSION["pid"]));
		while($res=$stm->fetch()){
			$stm1=$dbh->prepare("SELECT msgfrom,msgtext,ts FROM msg WHERE mid=?");
			$stm1->execute(array($res["mid"]));
			if($res1=$stm1->fetch()){
				if($res1["ts"]>time()-3){
					$stm2=$dbh->prepare("SELECT login FROM players WHERE pid=?");
					$stm2->execute(array($res1["msgfrom"]));
					if($res2=$stm2->fetch()){
						$login=$res2["login"];
					}
					echo "<p>".$login." :".$res1["msgtext"]."</p>";
				}
			}
		}
	}else{
		echo "<p>0</p>";
	}
	echo "</elementracine>";
?>