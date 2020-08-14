FROM alpine:3.8

WORKDIR /backend
COPY application ./application
COPY resources ./resources
COPY requirements.txt .
COPY run.py .

RUN apk add --no-cache python3-dev openssl-dev libffi-dev gcc musl-dev && pip3 install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000
ENTRYPOINT ["python3"]
CMD ["run.py"]
