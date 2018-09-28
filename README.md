#Reso IRC

Ce projet utilise docker-compose 3.

Pour le lancer: docker-composer up -d

Accès: http://localhost:8080

#Architecture

Un serveur Express fait le lien entre un client Vue et un serveur IRC.

Le lien entre le serveur Express et le client Vue est réalisé grâce à Socket.io.

Actuellement, deux fonctionnalités sont implémentées:
- Messagerie privée entre utilisateurs
- Messagerie de groupes entre plusieurs utilisateurs

Un bot a été créé (sur le serveur Express) permettant de lister les utilisateurs connectés au serveur.

L'étape suivante est de se connecter au serveur IRC via les identifiants LDAP.

### Pistes pour la connection avec le LDAP

Le but est que les utilisateurs ne puisses se connecter a la messagerie instantanée que s'il sont authentifier par le LDAP.

> Pour les utilisateurs se connectant via client IRC -> Identifiants LDAP

> Pour les utilisateurs se connectant via Le Reso, il faut se poser plus de questions:
il n'est pas possible d'envoyer les identifiants LDAP de l'utilisateur au serveur Express sans les lui redemander (nécessiterait un stockage du mdp, puis envoi via la websocket)
On peut cependant utiliser le protocol CAS dont une version simplifiée consisterait a générer un token en DB lorsque l'utilisateur se connecte et à le lui transmettre afin qu'il puisse utiliser ce token pour s'authentifier aux autres services.