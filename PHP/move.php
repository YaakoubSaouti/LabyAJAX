<?php
header("Content-Type: text/xml");
session_start();
include("laby.inc");
$dbh=new PDO("");
echo '<?xml version="1.0"?>';
	echo "<elementracine>";
	if(isset($_SESSION["pid"]) && isset($_SESSION["x"]) && is_numeric($_SESSION["x"]) && isset($_SESSION["y"]) && is_numeric($_SESSION["y"]) && isset($_SESSION["z"]) && is_numeric($_SESSION["z"]) && isset($_SESSION["dir"]) && is_numeric($_SESSION["dir"])){
			$x=$_SESSION["x"];
			$y=$_SESSION["y"];
			$z=$_SESSION["z"];
			$dir=$_SESSION["dir"];
			echo "<p>1</p>";
			if(isset($_GET["turnr"]) || isset($_GET["turnl"])){
				if(isset($_GET["turnr"])){
					$dir++;
					if($dir==4)
						$dir=0;
				}
				if(isset($_GET["turnl"])){
					$dir--;
					if($dir==-1)
						$dir=3;
				}
				$_SESSION["dir"]=$dir;
			}else{
				switch($dir){
					case 0:
						if(isset($_GET["fwd"]))
							$x--;
						if(isset($_GET["right"]))
							$y++;
						if(isset($_GET["back"]))
							$x++;
						if(isset($_GET["left"]))
							$y--;
						break;
					case 1:
						if(isset($_GET["fwd"]))
							$y++;
						if(isset($_GET["right"]))
							$x++;
						if(isset($_GET["back"]))
							$y--;
						if(isset($_GET["left"]))
							$x--;
						break;
					case 2:
						if(isset($_GET["fwd"]))
							$x++;
						if(isset($_GET["right"]))
							$y++;
						if(isset($_GET["back"]))
							$x--;
						if(isset($_GET["left"]))
							$y--;
						break;
					case 3:
						if(isset($_GET["fwd"]))
							$y--;
						if(isset($_GET["right"]))
							$x--;
						if(isset($_GET["back"]))
							$y++;
						if(isset($_GET["left"]))
							$x++;
						break;
				}
				switch($laby[$z][$x][$y]){
					case 4:
						$z++;
						if($z==1){
							$y--;
							$dir=3;
						}
						if($z==2){
							$y++;
							$dir=1;
						}
						break;
					case 5:
						$z--;
						if($z==0){
							$y--;
							$dir=3;
						}
						if($z==1){
							$y++;
							$dir=1;
						}
						break;
				}
				if($laby[$z][$x][$y]!=1 && $laby[$z][$x][$y]!=2){
					$_SESSION["x"]=$x;
					$_SESSION["y"]=$y;
					$_SESSION["z"]=$z;
					$_SESSION["dir"]=$dir;
					$stm=$dbh->prepare("UPDATE players SET x=?, y=?,z=? WHERE login=?");
					$stm->execute(array($_SESSION["x"],$_SESSION["y"],$_SESSION["z"],$_SESSION["login"]));
					if($res=$stm->fetch()){}
				}
			}
	}else{
		echo "<p>0</p>";
	}
	echo "</elementracine>";
?>