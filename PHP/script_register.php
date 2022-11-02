<?php
header("Content-Type: text/xml");
$dbh=new PDO(""); 
$reg_pseudo='/^[a-zA-Z]\w{2,19}$/';
$reg_mdp='/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{8,}$/';
$message=array();
$erreur=0;
if(!isset($_POST["pseudo"]) || !preg_match($reg_pseudo,$_POST["pseudo"])){
	$erreur=1;
	$message[]='Pseudo incorrect (3 lettres min. et pas de chiffre au début)!';
}else{
	$stm=$dbh->prepare("SELECT login FROM players");
	$stm->execute();
	while($res=$stm->fetch()){
		if($_POST["pseudo"]==$res["login"]){
			$erreur=1;
			$message[]='Pseudo deja pris!';
			break;
		}
	}
}
if(!isset($_POST["email"]) || !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
	$erreur=1;
	$message[]='Email non valide!';
}else{
	$stm=$dbh->prepare("SELECT email FROM players");
	$stm->execute();
	while($res=$stm->fetch()){
		if($_POST["email"]==$res["email"]){
			$erreur=1;
			$message[]='Email deja pris!';
			break;
		}
	}
}
if(!isset($_POST["mdp1"]) || !preg_match($reg_mdp,$_POST["mdp1"])){
	$message[]='Mot de passe incorrect(une majuscule, un caractères spéciale,une minuscule et un nombre requis, 8 caractères min.)!';
	$erreur=1;
}
if(!isset($_POST["mdp2"]) || $_POST["mdp1"]!=$_POST["mdp2"]){
	$message[]='Les deux mots de passe ne correspondent pas!';
	$erreur=1;
}
if($erreur==0){
	$stm=$dbh->prepare("INSERT INTO players(login,passwd,email,x,y,z) VALUES(?,?,?,?,?,?)");
	$stm->execute(array($_POST["pseudo"],$_POST["mdp1"],$_POST["email"],1,1,0));
}

echo '<?xml version="1.0"?>';
	echo "<elementracine>";
		echo "<p>$erreur</p>";
		if($erreur==1){
			for($i=0;$i<count($message);$i++){
				echo "<p>$message[$i]</p>";
			}
		}
	echo "</elementracine>";
?>