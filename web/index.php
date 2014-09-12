<?php
/*
$file1 = file_get_contents('templates/1.txt');
$file1 .= "\n" . file_get_contents('templates/2.txt');
$file1 .= "\n" . file_get_contents('templates/3.txt');

$fp = fopen('output.txt', 'w');
if(!$fp)
    die('Datei kann nicht erstellt werden');
if(fwrite($fp, $file1) === false)
    die('Datei kann nicht beschrieben werden.');

echo '.gitignore erstellt.';
*/




$dir = 'templates/';
$dh = opendir($dir);
while (($file = readdir($dh)) !== false){
    $fullfile = $dir ."/". $file;
    $subtotal[] = file_get_contents($fullfile);
}
//print_r($subtotal);
$serializedData = implode("\n", $subtotal);
file_put_contents('output.txt', $serializedData);

//at a later point, you can convert it back to array like
//$recoveredData = file_get_contents('your_file_name.txt');



?>
