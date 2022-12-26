# How to start server
기존 프로젝트에서는 AWS 로 클라우드 서버를 실행시켜서 사용했으나,<br>로컬에서 서버를 실행하여 사용하려면 다음 과정이 필요합니다.
1. 해당 폴더 위치로 이동
> cd ./Backend

2. 의존성 모듈들 설치 (node_modules 폴더 생성)
> npm install

3. 데이터베이스 생성
> 프로젝트에 사용된 데이터베이스를 만들어줘야합니다.<br>
자세한 db 구조는 [프로젝트 백엔드 설명](https://lavender-condition-f6f.notion.site/BackEnd-96b9c9c2134a4796b47d2c5171ef6995)(로컬 서버로 실행하기)에서

4. 파일 추가하기 (gitignore 되어 있음)
> -Backend/config/database.js<br>
-Backend/config/secret.js<br>
파일 추가해주기 (샘플 파일은 sample 폴더에 있음)

5. 서버 실행하기
> node index.js

<br>

# How to start project
(<b>로컬이든 원격이든 서버를 실행시킨 이후</b>) 실제 서비스를 실행하는 방법입니다.
1. 해당 폴더 위치로 이동
> cd ./Frontend

2. 의존성 모듈들 설치 (node_modules 폴더 생성)
> npm install<br>
(경우에 따라, npm install --force)

3. 파일 수정
> Frontend/src/config/serverHost.js 파일에서<br>
'current_host'와 'current_port'를 본인이 사용하는 호스트와 포트 번호로 변경하기

4. 프로젝트 실행하기
> npm start

<br>

# How to setup summarization
> Text Summarazition 폴더의 readme.md 를 확인해주세요!