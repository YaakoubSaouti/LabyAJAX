<?php
header("Content-Type: text/xml");
$dbh=new PDO(""); 
$erreur=1;

if(isset($_POST["pseudo"]) && isset($_POST["mdp"])){
	$stm=$dbh->prepare("SELECT pid,login,passwd,x,y,z FROM players");
	$stm->execute();
	while($res=$stm->fetch()){
		if($_POST["pseudo"]==$res["login"] && $_POST["mdp"]==$res["passwd"]){
			$erreur=0;
			session_start();
			$_SESSION["pid"]=$res["pid"];
			$_SESSION["x"]=$res["x"];
			$_SESSION["y"]=$res["y"];
			$_SESSION["z"]=$res["z"];
			$_SESSION["dir"]=0;
			break;
		}
	}
}

echo '<?xml version="1.0"?>';
	echo "<elementracine>";
		echo "<p>$erreur</p>";
		if($erreur==1){
			echo "<p>Pseudo ou mot de passe incorrect</p>";
		}
	echo "</elementracine>";
?>