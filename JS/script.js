//Variables globales
var imgBack;
var tabL1S= new Array(6);
var tabL1F= new Array(5);
var tabL2S= new Array(4);
var tabL2F= new Array(3);
var tabL3S= new Array(2);
var tabL3F= new Array(3);
var tabL4S= new Array(2);
for(var i=0;i<6;i++){
    if(i<5){
        tabL1F[i]=new Array(6);
    }
    if(i<4){
        tabL2S[i]=new Array(6);
    }
    if(i<3){
        tabL2F[i]=new Array(6);
        tabL3F[i]=new Array(6);
    }
    if(i<2){
        tabL3S[i]=new Array(6);
        tabL4S[i]=new Array(6);
    }
    tabL1S[i]=new Array(6);
}
var tabDir= new Array(4);
var tabCommande= new Array(6);
var image_charged=0;
var current_theme=0;
var recevoir;

//Initialise le tableau d'images de commande
function initCommande(){
    var commandeTab= new Array(6);
    commandeTab=["turnleft","movefwd","turnright","moveleft","moveback","moveright"];
    for(var i=0;i<tabCommande.length;i++){
        var image= new Image();
        image.height="43";
        image.width="57";
        image.src="Image/"+commandeTab[i]+".png";
        tabCommande[i]=image;
    }
}

//Initialise les tableau d'images de la boussole
function initDir(){
    var dirTab= new Array(4);
    dirTab=["compass-N","compass-E","compass-S","compass-W"];
    for(var i=0;i<dirTab.length;i++){
        var image= new Image();
        image.height="47";
        image.width="100";
        image.src="Image/"+dirTab[i]+".png";
        tabDir[i]=image;
    }
}

//Switch pour le choix du thème
function switch_theme(theme_src){
    var theme_src;

    switch(theme_src){
        case 1:
            theme_src="Image/BLUE.";
            break;
        case 2:
            theme_src="Image/BRICK.";
            break;
        case 3:
            theme_src="Image/DROW.";
            break;
        case 4:
            theme_src="Image/GREEN.";
            break;
        case 5:
            theme_src="Image/XANATHA.";
            break;
    }

    return theme_src;
}

//Permet de changer de theme pour une couche
function changer_src(layer,theme_src,nbr_lettre,type,lettres,tab){
    var c = $("game_canvas");
    var ctx = c.getContext("2d");
    var str=lettres;
    var h,l;
    for(var i=0;i<nbr_lettre;i++){
        for(var j=0;j<6;j++){
            layer[i][j]=new Image();
            layer[i][j].onload=function(){
                l=Math.trunc(640/151)*image_charged;
                h=Math.trunc(400/151)*image_charged;
                ctx.fillRect(320-(l/2), 200-(h/2),l,h);
                image_charged++;
                if(image_charged==151){
                    gestion_commande(true);
                    afficher_laby(tab);
                    image_charged=0;
                }
            };
            layer[i][j].src=theme_src.concat(str.charAt(i),type,j,".png");
        }
    }
}

//Permet de changer le theme de toute les couches
function changeAllSrc(theme,tab){
    if(current_theme!=theme){    
        var c = $("game_canvas");
        var ctx = c.getContext("2d");
        var theme_src,h,l;;
        theme_src=switch_theme(theme);
        changer_src(tabL1S,theme_src,6,"S","ABCEFG",tab);
        changer_src(tabL1F,theme_src,5,"F","BCDEF",tab);
        changer_src(tabL2S,theme_src,4,"S","HIKL",tab);
        changer_src(tabL2F,theme_src,3,"F","IJK",tab);
        changer_src(tabL3S,theme_src,2,"S","MO",tab);
        changer_src(tabL3F,theme_src,3,"F","MNO",tab);
        changer_src(tabL4S,theme_src,2,"S","PQ",tab);
        imgBack=new Image();
        imgBack.onload=function(){
            l=Math.trunc(640/151)*image_charged;
            h=Math.trunc(400/151)*image_charged;
            ctx.fillRect(320-(l/2), 200-(h/2),l,h);
            image_charged++;
            if(image_charged==151){
                gestion_commande(true);
                afficher_laby(tab);
                image_charged=0;
            }
        };
        imgBack.src=theme_src.concat("BACK.png");
    }
}

//Affiche les commandes
function afficher_commande(){
    $("commande").innerHTML="";
    var commandeTab= new Array(6);
    commandeTab=["turnleft","movefwd","turnright","moveleft","moveback","moveright"];
    for(var i=1;i<=6;i++){
        var div=document.createElement("div");
        div.id=commandeTab[i-1];
        div.className="img_commande";
        if(i%3==0){
            div.className+=" comright";
        }
        if(i<=3){
            div.className+=" comtop";
        }
        div.appendChild(tabCommande[i-1]);
        $("commande").appendChild(div);
    }
}

//Affiche la direction
function afficher_dir(imageDir){
    $("img_compass").innerHTML="";
    $("img_compass").appendChild(imageDir);
}

//Afficher les joueurs dans le select
function display_players(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var players=new Array();
                var xmlDoc=xhr.responseXML;
                var xmlelmts= xmlDoc.getElementsByTagName("p");
                for(var i=0;i<xmlelmts.length;i++){
                    if(xmlelmts[i].firstChild){
                        players[i]=xmlelmts[i].firstChild.nodeValue;
                    }
                }
                if(players[0]==1){
                    for(var i=1;i<players.length;i++){
                        $("players").innerHTML+="<option value=\""+players[i]+"\">"+players[i]+"</option>";
                    }
                }else{
                    afficher_ecran_login();
                }
            }
        }
    };
    xhr.open("GET","PHP/get_players.php?");
    xhr.send(null);
}

//Pemet d'envoyer un message
function envoyer_message(){
    if($("chat_message").value!=""){
        var message=$("chat_message").value;
        var player=$("players").value;
        var param;
        param="message="+encodeURIComponent(message)+"&player="+encodeURIComponent(player);
        xhr=new XMLHttpRequest();
        xhr.onreadystatechange= function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var xmlDoc=xhr.responseXML;
                    var xmlelmts= xmlDoc.getElementsByTagName("p");
                    if(xmlelmts[0].firstChild){
                        if(xmlelmts[0].firstChild.nodeValue==1){
                            if(xmlelmts[1].firstChild && xmlelmts[2].firstChild)
                                $("espace_message").innerHTML+=xmlelmts[1].firstChild.nodeValue+" : "+xmlelmts[2].firstChild.nodeValue+"<br><br>";
                                $("chat_message").value="";
                        }else{
                            afficher_ecran_login();
                        }
                    }
                }
            }
        };
        xhr.open("POST","PHP/send_message.php?"+param,true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(param);
    }
}

//Fonction qui verifie si des messages ont été reçus
function recevoir_message(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var msg= new Array();
                var xmlelmts= xhr.responseXML.getElementsByTagName("p");
                for(var i=0;i<xmlelmts.length;i++){
                    if(xmlelmts[i].firstChild){
                        msg[i]=xmlelmts[i].firstChild.nodeValue;
                    }
                }
                if(msg[0]==1){
                    for(var i=1;i<msg.length;i++){
                        $("espace_message").innerHTML+=msg[i]+"<br><br>";
                    }
                }else{
                    afficher_ecran_login();
                }
            }
        }
    };
    xhr.open("GET","PHP/get_message.php?");
    xhr.send(null);
}

//Fonction qui charge la conversation depuis 2 jours
function load_conv(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var msg= new Array();
                var xmlelmts= xhr.responseXML.getElementsByTagName("p");
                for(var i=0;i<xmlelmts.length;i++){
                    if(xmlelmts[i].firstChild){
                        msg[i]=xmlelmts[i].firstChild.nodeValue;
                    }
                }
                var todisplay;
                if(msg[0]==1){
                    for(var i=1;i<msg.length;i++){
                        todisplay=msg[i].split("/");
                        $("espace_message").innerHTML+=todisplay[1]+"<br><br>";
                    }
                }else{
                    afficher_ecran_login();
                }
            }
        }
    };
    xhr.open("GET","PHP/get_conv.php?");
    xhr.send(null);
}

//met à jour l'affichage du canvas
function afficher_laby(tabCases){
    var i,cpt=0;

    var ctx=$("game_canvas").getContext("2d");
    ctx.clearRect(0,0,640,400);

    //Layer 0:
    ctx.drawImage(imgBack,0,0,176,120,0,0,640,400);
    //Layer 1:
    cpt=0;
    for(i=0;i<7;i++){
        if(i!=3){
            if(tabCases[0][i]){
                ctx.drawImage(tabL1S[cpt][tabCases[0][i]-1],0,0,176,120,0,0,640,400);
            }
            cpt++;
        }
    }
    //Layer 2:
    for(i=1;i<=5;i++){
        if(tabCases[0][i]){
            ctx.drawImage(tabL1F[i-1][tabCases[0][i]-1],0,0,176,120,0,0,640,400);
        }
    }
    //Layer 3:
    cpt=0;
    for(i=1;i<=5;i++){
        if((i!=3)){
            if(tabCases[1][i]){
                ctx.drawImage(tabL2S[cpt][tabCases[1][i]-1],0,0,176,120,0,0,640,400);
            }
            cpt++;
        }
    }
    //Layer 4:
    for(i=2;i<=4;i++){
        if(tabCases[1][i]){
            ctx.drawImage(tabL2F[i-2][tabCases[1][i]-1],0,0,176,120,0,0,640,400);
        }
    }
    //Layer 5:
    cpt=0;
    for(i=2;i<=4;i++){
        if(i!=3){
            if(tabCases[2][i]){
                ctx.drawImage(tabL3S[cpt][tabCases[2][i]-1],0,0,176,120,0,0,640,400);
            }
            cpt++;
        }
    }
    //Layer 6:
    for(i=2;i<=4;i++){
        if(tabCases[2][i]){
            ctx.drawImage(tabL3F[i-2][tabCases[2][i]-1],0,0,176,120,0,0,640,400);
        }
    }
    //Layer 7:
    cpt=0;
    for(i=2;i<=4;i++){
        if((i!=3)){
            if(tabCases[3][i]){
                ctx.drawImage(tabL4S[cpt][tabCases[3][i]-1],0,0,176,120,0,0,640,400);
            }
            cpt++;
        }
    }
}

//Traite l'initialisation lors de la connexion
function trait_init_log(xmlDoc){
    var tab_pos=new Array(4);
    var tab= new Array();
    var xmlelmts= xmlDoc.getElementsByTagName("p");
    for(var i=0;i<xmlelmts.length;i++){
        if(xmlelmts[i].firstChild){
            tab[i]=xmlelmts[i].firstChild.nodeValue;
        }
    }
    if(tab[0]==1){
        for(i=1;i<tab.length-1;i++){
            tab_pos[i-1]=new Array();
            for(var j=0;j<7;j++){
                tab_pos[i-1][j]=parseInt(tab[i].substr(j,1));
            }
        }
        clear($("message_login"),"cl");
        var coord=tab[tab.length-1].split(",");
        afficher_dir(tabDir[parseInt(coord[3])]);
        display_players();
        $("coord_span").innerHTML="X: "+coord[0]+" / Y: "+coord[1]+" / Z: "+coord[2];
        load_conv();
        changeAllSrc(parseInt(coord[2])+1,tab_pos);
        current_theme=parseInt(coord[2])+1;
        recevoir=setInterval(recevoir_message,2000);
    }else{
        clear($("message_login"),"cl");
        afficher_ecran_login();
    }
}

//Fonction qui initialise la connexion
function init_login(){
    afficher_ecran_game();
    afficher_commande();
    xhr=new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                trait_init_log(xhr.responseXML);
            }
        }
    };
    xhr.open("GET","PHP/script_map.php?");
    xhr.send(null);
}

//Traite le retour de la validation de la connexion
function trait_log(xmlDoc){
    var tab= new Array();
    var list=$("message_login");
    var xmlelmts= xmlDoc.getElementsByTagName("p");
    for(var i=0;i<xmlelmts.length;i++){
        //attention à mettre partout
        if(xmlelmts[i].firstChild){
            tab[i]=xmlelmts[i].firstChild.nodeValue;
        }
    }
    if(tab[0]==1){
        list.innerHTML="";
        for(var i=1;i<tab.length;i++){
            var li=document.createElement("li");
            var message=document.createTextNode(tab[i]);
            li.appendChild(message);
            list.appendChild(li);
        }
        list.style.display="block";
    }else{
        clear(list,"cl");
        init_login();
    }
}

//Traite le retour de la validation de l'inscription
function trait_reg(xmlDoc){
    var tab= new Array();
    var list=$("message_register");
    var xmlelmts= xmlDoc.getElementsByTagName("p");
    for(var i=0;i<xmlelmts.length;i++){
        if(xmlelmts[i].firstChild){
            tab[i]=xmlelmts[i].firstChild.nodeValue;
        }
    }
    if(tab[0]==1){
        list.innerHTML="";
        for(var i=1;i<tab.length;i++){
            var li=document.createElement("li");
            var message=document.createTextNode(tab[i]);
            li.appendChild(message);
            list.appendChild(li);
        }
        list.style.display="block";
    }else{
        afficher_ecran_login();
        clear(list,"cr");
    }
}

//Valide la connexion
function fct_login(){
    var pseudo=$("login_ps").value;
    var mdp=$("login_mdp").value;
    var param;
    param="pseudo="+encodeURIComponent(pseudo)+"&mdp="+encodeURIComponent(mdp);
    xhr=new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                trait_log(xhr.responseXML);
            }
        }
    };
    xhr.open("POST","PHP/script_connexion.php",true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(param);
}

//Valide l'inscription
function fct_register(){
    var mdp1=$("register_mdp1").value;
    var mdp2=$("register_mdp2").value;
    var pseudo=$("register_ps").value;
    var email=$("register_email").value;
    var param;
    param="pseudo="+encodeURIComponent(pseudo)+"&email="+encodeURIComponent(email);
    param=param+"&mdp1="+encodeURIComponent(mdp1)+"&mdp2="+encodeURIComponent(mdp2);
    xhr=new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                trait_reg(xhr.responseXML);
            }
        }
    };
    xhr.open("POST","PHP/script_register.php",true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(param);
}

//Choix de deplacement
function move_switch(todo){
    var param;
    switch(todo){
        case "turnl":
                param="turnl="+encodeURIComponent(1);
                break;
        case "turnr":
                param="turnr="+encodeURIComponent(1);
                break;
        case "fwd":
                param="fwd="+encodeURIComponent(1);
                break;
        case "back":
                param="back="+encodeURIComponent(1);
                break;
        case "right":
                param="right="+encodeURIComponent(1);
                break;
        case "left":
                param="left="+encodeURIComponent(1);
                break;
    }
    return param;
}

//Fonction de déplacement
function move(todo){
    xhr=new XMLHttpRequest();
    var param=move_switch(todo);
    xhr.open("GET","PHP/move.php?"+param);
    xhr.onreadystatechange= function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var xmlelmts=xhr.responseXML.getElementsByTagName("p");
                if(xmlelmts[0].firstChild){
                    if(xmlelmts[0].firstChild.nodeValue==0){
                        afficher_ecran_login();
                    }
                }
                return_pos();
            }
        }
    };
    xhr.send(null);
}

//Traite le retour de position vu par le joueur
function trait_return_pos(xmlDoc){
    var tab_pos=new Array(4);
    var tab= new Array();
    var xmlelmts= xmlDoc.getElementsByTagName("p");
    for(var i=0;i<xmlelmts.length;i++){
        if(xmlelmts[i].firstChild){
            tab[i]=xmlelmts[i].firstChild.nodeValue;
        }
    }
    if(tab[0]==1){
        for(i=1;i<tab.length;i++){
            tab_pos[i-1]=new Array();
            for(var j=0;j<7;j++){
                tab_pos[i-1][j]=parseInt(tab[i].substr(j,1));
            }
        }
        var coord=tab[tab.length-1].split(",");
        afficher_dir(tabDir[parseInt(coord[3])]);
        if(parseInt(coord[2])+1!=current_theme){
            gestion_commande(false);
            changeAllSrc(parseInt(coord[2])+1,tab_pos);
            current_theme=parseInt(coord[2])+1;
        }else{
            afficher_laby(tab_pos);
        }
        $("coord_span").innerHTML="X: "+coord[0]+" / Y: "+coord[1]+" / Z: "+coord[2];
    }else{
        afficher_ecran_login();
    }
}

//Demande les position vues par le joueur
function return_pos(){
    xhr=new XMLHttpRequest();
    xhr.open("GET","PHP/script_map.php?");
    xhr.onreadystatechange= function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                trait_return_pos(xhr.responseXML);
            }
        }
    };
    xhr.send(null);
}

//Permet d'activer ou desactiver les commandes
function gestion_commande(enable){
    if(enable){ 
        $("turnleft").onclick=function(){ move("turnl");};
        $("turnright").onclick=function(){ move("turnr");};
        $("movefwd").onclick=function(){ move("fwd");};
        $("moveback").onclick=function(){ move("back");};
        $("moveleft").onclick=function(){ move("left");};
        $("moveright").onclick=function(){ move("right");};
        $("btn_chat").onclick=envoyer_message;
    }else{
        $("turnleft").removeAttribute("onclick");
        $("turnright").removeAttribute("onclick");
        $("movefwd").removeAttribute("onclick");
        $("moveback").removeAttribute("onclick");
        $("moveleft").removeAttribute("onclick");
        $("moveright").removeAttribute("onclick");
    }
}

//Efface les champs et les messages d'erreur
function clear(id,classtoclear){
    id.innerHTML="";
    id.style.display="none";
    var tab=document.getElementsByClassName(classtoclear);
    for(var i=0;i<tab.length;i++){
        tab[i].value="";
    }
}

//Gere le bouton se connecter
function click_log(){
    clear($("message_register"),"cr");
    afficher_ecran_login();
}

//Gere le bouton s'inscrire
function click_reg(){
    clear($("message_login"),"cl");
    afficher_ecran_register();
}

//Permet de se deconnecter
function logout(){
    xhr=new XMLHttpRequest();
    xhr.open("GET","PHP/logout.php?");
    xhr.send(null);
    afficher_ecran_login();
    $("espace_message").innerHTML="Voici le début de vos conversasion:<br><br>";
    $("players").innerHTML="";
    clearInterval(recevoir);
}

//Afficher l'écran de connexion
function afficher_ecran_login(){
    $("login_div").style.display="block";
    $("register_div").style.display="none";
    $("game_div").style.display="none";
}

//Afficher l'écran d'inscription
function afficher_ecran_register(){
    $("register_div").style.display="block";
    $("login_div").style.display="none";
    $("game_div").style.display="none";
}

//Afficher l'écran de jeu
function afficher_ecran_game(){
    $("game_div").style.display="block";
    $("register_div").style.display="none";
    $("login_div").style.display="none";
}

//Initialise le site
function init_site(){
    initCommande();
    initDir();
    $("btn_register").onclick=click_reg;
    $("btn_login").onclick=click_log;
    $("ok_register").onclick=fct_register;
    $("ok_login").onclick=fct_login;
    $("logout").onclick=logout;
    afficher_ecran_login();
}

//Fonction qui se lance lors du chargement
function init(ev){
    init_site();
}

(function() {
    var fired=0;
    var tmr=null;
    
    function onReady(ev) {
        if (tmr) {
            clearTimeout(tmr);
        }
        if (fired) {
            return false;
        }
        if (document.readyState == "complete") {
            fired=1;
            window.removeEventListener("load",onReady,false);
            document.removeEventListener("DOMContentLoaded",onReady,false);
            document.removeEventListener("readystatechange",onReady,false);
            init();
        } else {
            tmr = setTimeout(onReady, 1);
        }
    }
    
    window.addEventListener("load",onReady,false);
    document.addEventListener("DOMContentLoaded",onReady,false);
    document.addEventListener("readystatechange",onReady,false);
    tmr=setTimeout(onReady,10);
    if (document.readyState == "complete") {
        onReady();
    }
} ());