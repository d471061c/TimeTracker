FROM alpine:3.8

WORKDIR /backend
COPY application ./application
COPY resources ./resources
COPY requirements.txt .
COPY run.py .

RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev libffi-dev \
    && pip3 install --upgrade pip \
    && pip3 install -r requirements.txt

EXPOSE 8000
ENTRYPOINT ["python3"]
CMD ["run.py"]
