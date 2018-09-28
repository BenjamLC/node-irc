FROM debian:stretch

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    slapd \
    ldap-utils \
    && apt-get clean \
    && /etc/init.d/slapd stop \
    && rm -rf /var/lib/ldap/* \
    && rm -rf /etc/ldap/slapd.d \
    && rm /etc/ldap/ldap.conf \
    && rm -R /etc/ldap/schema

COPY ./config/ /etc/ldap/

RUN mkdir /etc/ldap/slapd.d \
    && slapadd -F /etc/ldap/slapd.d -n 0 -l /etc/ldap/conf.ldif \
    && slapadd -F /etc/ldap/slapd.d -n 1 -l /etc/ldap/users.ldif \
    && chown -R openldap:openldap /var/lib/ldap \
    && chown -R openldap:openldap /etc/ldap/slapd.d

EXPOSE 389

ENTRYPOINT ["slapd"]

CMD ["-h", "ldap:/// ldapi:/// ldaps:///", "-u", "openldap", "-g", "openldap", "-dStats,Stats2"]