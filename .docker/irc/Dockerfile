FROM alpine:3.8

RUN apk update \
    && apk add ngircd \
    && rm -rf /var/cache/apk/*

EXPOSE 6667
CMD [ "/usr/sbin/ngircd", "-n" ]