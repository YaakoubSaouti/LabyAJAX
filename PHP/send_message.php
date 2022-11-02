<?php
header("Content-Type: text/xml");
session_start();
include("laby.inc");
$dbh=new PDO("");
echo '<?xml version="1.0"?>';
	echo "<elementracine>";
	if(isset($_SESSION["pid"]) && isset($_SESSION["x"]) && is_numeric($_SESSION["x"]) && isset($_SESSION["y"]) && is_numeric($_SESSION["y"]) && isset($_SESSION["z"]) && is_numeric($_SESSION["z"]) && isset($_SESSION["dir"]) && is_numeric($_SESSION["dir"])){
		$message=$_POST["message"];
		$player=$_POST["player"];
		echo "<p>1</p>";
		echo "<p>Vous($player) </p>";
		echo "<p>$message</p>";
		$stm=$dbh->prepare("INSERT INTO msg(msgfrom,msgtext,ts,msgtype) VALUES(?,?,?,?)");
		$stm->execute(array($_SESSION["pid"],$_POST["message"],time(),0));
		if($res=$stm->fetch()){}
		$stm=$dbh->prepare("SELECT MAX(mid) FROM msg");
		$stm->execute();
		if($res=$stm->fetch()){
			$mid=$res[0];
		}
		$stm=$dbh->prepare("SELECT pid FROM players WHERE login=?");
		$stm->execute(array($_POST["player"]));
		if($res=$stm->fetch()){
			$msgto=$res["pid"];
		}
		$stm=$dbh->prepare("INSERT INTO msgto(mid,msgto) VALUES(?,?)");
		$stm->execute(array($mid,$msgto));
		if($res=$stm->fetch()){}
	}else{
		echo "<p>0</p>";
	}
	echo "</elementracine>";
?>