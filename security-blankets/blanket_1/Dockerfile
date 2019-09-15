FROM alpine
RUN apk update && apk add curl && adduser -D -g '' micky_mouse && adduser -D -g '' donald_duck
USER micky_mouse
WORKDIR /home/micky_mouse