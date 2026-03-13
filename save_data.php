<?php

$data = file_get_contents("php://input");

$file = "data/dataset.csv";

file_put_contents($file,$data,FILE_APPEND);

?>
