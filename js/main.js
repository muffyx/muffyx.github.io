'use strict';

// Модуль приложения
var app = (function($) {

    // Валидация файлов
    function validateFiles(options) {
        var result = [],
            file;

        // Перебираем файлы
        options.$files.each(function(index, $file) {
            // Выбран ли файл
            if (!$file.files.length) {
                result.push({index: index, errorCode: 'no_file'});
                // Остальные проверки не имеют смысла, переходим к следующему файлу
                return;
            }

            file = $file.files[0];
            // Проверяем размер
            if (file.size > options.maxSize) {
                result.push({index: index, name: file.name, errorCode: 'big_file'});
            }
            // Проверяем тип файла
            if (options.types.indexOf(file.type) === -1) {
                result.push({index: index, name: file.name, errorCode: 'wrong_type'});
            }
        });

        return result;
    }

    // Отправка формы
    function submitForm(e) {
        e.preventDefault();

        var $photos = $('.js-photos'),
            formdata = new FormData,
            validationErrors = validateFiles({
                $files: $photos,
                maxSize: 2 * 1024 * 1024,
                types: ['image/jpeg', 'image/jpg', 'image/png']
            });

        // Валидация
        if (validationErrors.length) {
            console.log('client validation errors: ', validationErrors);
            return false;
        }

        // Добавление файлов в formdata
        $photos.each(function(index, $photo) {
            if ($photo.files.length) {
                formdata.append('photos[]', $photo.files[0]);
            }
        });

        // Отправка на сервер
        $.ajax({
            url: 'php/upload.php',
            data: formdata,
            type: 'POST',
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(responce) {
                console.log('responce from server: ', responce);
            }
        });
    }

    // Инициализация
    function init() {
        $('#main-form').on('submit', submitForm);
    }
    
    return {
        init: init
    }    

})(jQuery);

// Запуск приложения
jQuery(document).ready(app.init);
