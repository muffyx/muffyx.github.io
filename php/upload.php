<?php

// Валидация файлов
function validateFiles($options) {
    $result = array();

    $files = $options['files'];
    foreach ($files['tmp_name'] as $key => $tempName) {
        $name = $files['name'][$key];
        $size = filesize($tempName);
        $type = $files['type'][$key];

        // Проверяем размер
        if ($size > $options['maxSize']) {
            array_push($result, array(
                'name' => $name,
                'errorCode' => 'big_file'
            ));
        }

        // Проверяем тип файла
        if (!in_array($type, $options['types'])) {
            array_push($result, array(
                'name' => $name,
                'errorCode' => 'wrong_type'
            ));
        }
    }

    return $result;
}


// Начало работы скрипта

$photos = $_FILES['photos'];
$destPath = $_SERVER['DOCUMENT_ROOT'] . '/upload/';

// Валидация
$validationErrors = validateFiles(array(
    'files' => $photos,
    'maxSize' => 2 * 1024 * 1024,
    'types' => array('image/jpeg', 'image/jpg', 'image/png')
));

if (count($validationErrors) > 0) {
    // Возвращаем список ошибок клиенту
    echo json_encode($validationErrors);
    exit;
}

// Копирование файлов в нужную папку
foreach ($photos['name'] as $key => $name) {
    $tempName = $photos['tmp_name'][$key];
    $destName = $destPath . $name;

    move_uploaded_file($tempName, $destName);
}

// Возвращаем ответ клиенту
echo json_encode(array(
    'code' => 'success'
));
