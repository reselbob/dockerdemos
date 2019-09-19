FROM python:2.7-alpine
RUN adduser -D -g '' cool_user
ENV APP_NAME=GOOD_DOG
USER cool_user
WORKDIR /app
COPY killer.py /app
ENTRYPOINT ["python", "killer.py"]
#CMD ["/usr/local/bin/python", "killer.py"]