<h1 class="nombre-pagina">Panel de Administración</h1>

<?php include_once __DIR__ . '/../templates/barra.php'; ?>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form action="" class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" name="fecha" value="<?php echo $fecha; ?>">
        </div>
    </form>
</div>

<?php 
    if(count($citas) === 0){
        echo "<h2>No Hay Citas en Esta Fecha</h2>";
    }
?>


<div id="citas-admin">
    <ul class="citas">
        <?php 
        $idCita = 0;
            foreach($citas as $key => $cita):
                if($idCita !== $cita->id):
                    $total = 0;
                    $idCita = $cita->id;
        ?>
            <li>
                <p>ID: <span><?php echo $cita->id;?></span></p>
                <p>Hora: <span><?php echo $cita->hora;?></span></p>
                <p>Cliente: <span><?php echo $cita->cliente;?></span></p>
                <p>Email: <span><?php echo $cita->email;?></span></p>
                <p>Telefono: <span><?php echo $cita->telefono;?></span></p>

                <h3>Servicios</h3>
                <?php endif; ?>
                <?php $total = $total + $cita->precio ?>
                <p class="servicio">Servicio: <span><?php echo $cita->servicio . " $" . $cita->precio;?></span></p>
                    <?php
                        $actual = $cita->id;
                        $proximo = $citas[$key + 1]->id ?? 0;
                       if(esUltimo($actual, $proximo)){
                        echo "<p class='total'>Total: <span>$" . $total . ".00</span></p>";
                        ?>
                            <form action="/api/eliminar" method="POST">
                                <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                                <input class="boton-eliminar" type="submit" name="eliminar" value="eliminar">
                            </form>
                        <?php } ?>
        <?php endforeach; ?>
    </ul>
</div>

<?php
$script = "<script src='build/js/buscador.js'></script>";

?>