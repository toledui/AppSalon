<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

// Función que revisa si el usuario está autenticado

function isAuth() : void {
    if(!isset($_SESSION['login'])){
        header('Location: /');
    }
}

// detecta el último id

function esUltimo(string $actual, string $proximo) : bool{
    if($actual !== $proximo){
        return true;
    }else{
        return false;
    }
}

// Función para saber si es admin
function isAdmin() : void{
    if(!isset($_SESSION['admin'])){
        header('Location: /');
    }
}