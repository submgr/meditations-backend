Для запуска представленного в этом архиве бэкенда приложения Медитаций, необходимо выполнить несколько шагов. Вообще, основное место хранения кода бэкенда - Github, это не только удобно, но и очень практично: как только я коммичу новую версию, благодаря Github  Actions, обновления почти сразу-же применяются и на продакшн-сервере.

Шаги.

Шаг 1. Установите необходимые модули (они нужны обязательно для работы проекта):
    npm install
                   
                   (данный код автоматически установить все необходимое, главное - выполняйте эту команду в корне папки с проектом).
                   
Шаг 2. Импортируйте Базу данных.
	   В архиве так же представлен файл Dump.sql, который необходимо импортировать в созданную для этого Базу данных (да, придется). Протестировано на MySQL Community Server версии 8.
	   
Шаг 3. Заполните файл конфигурации
	   В архиве представлен файл .env.example. Его необходимо переименовать в .env и заполнить нахоядщиеся в нем поля. Например, не забудьте указать сведения для подключения к базе данных.   
	   
Шаг 4. Похоже готово!
	   Запускаем бэкенд командой npm start (или node index.js, кому как нравится! и наслаждаемся сервисом медитации.
	   
	   Но важно помнить, что Бэкенд данного проекта - это API, а значит, его нужно связать с приложением. Я заранее это продумал, поэтому редактирование адреса сервера в приложении не будет сложным. Достаточно открыть в Android Studio файл размети string.yml и в самом начале благодаря комментариям вы найдете место, где нужно вносить изменения.
	   
	   
	   Я разместил Бэкенд в облаке Microsoft и он доступен по следующему адресу: https://meditations-app.azurewebsites.net/. По идее, он должен стабильно работать, но не могу гарантировать, что на момент проверки он будет доступен (облако дорогое, а я - школьник. Но пока у меня есть Microsoft Azure for Students - все хорошо).
	   
	   
	   
	   Хорошего дня и удачной настройки проекта!:)
	   
