FROM node:12-alpine AS builder

COPY backend /backend
COPY frontend /frontend

RUN cd frontend && yarn && yarn build && cd build \
    && mv index.html ../../backend/resources/templates \
    && mv * ../../backend/resources/static

FROM alpine:3.8
COPY --from=builder /backend /timetracker
WORKDIR /timetracker

RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev libffi-dev \
    && pip3 install --upgrade pip \
    && pip3 install -r requirements.txt

EXPOSE 8000
ENTRYPOINT ["gunicorn"]
CMD ["application:app"]