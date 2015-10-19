#Chat 2Gis
*Простой чат
-Node.js server
-WebSocket
-Mocha test

Сообщения храняться в памяти node.js после перезапуска сервера очищаются.
Одна комната чата для всех пользователей.
При входе в чат загружает все прошлые сообщения.

## Requirements
	- node -v v0.12.7
	- npm -v 3.3.4
	- git
	
## Install
	```
    $ npm install
    $ npm build
    ```

## Run
	```
    $ node server-run.js
    ```
	Open in your browser http://127.0.0.1:8080
	
## Test
	```
    $ npm test
    ```
