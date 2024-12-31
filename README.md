
![GitHub commit](https://img.shields.io/github/last-commit/OpenSourceLynix/falcon) ![GitHub Release](https://img.shields.io/github/v/release/OpenSourceLynix/falcon)


[Vietnamese](https://github.com/symthptic/falcon/blob/main/lang/vn.md) | [Chinese](https://github.com/Symthoptic/falcon/blob/main/lang/cn.md) | [Russian](https://github.com/Symthoptic/falcon/blob/main/lang/ru.md)

> [!CAUTION]
> Falcon reaches end of life. We recommend to shift to any  other client area because falcon will not be updated any more you can shift to [Fixed-Palladium](https//github.com/Overnodeprojects/Fixed-Palladium) this is the base of falcon. If you found out any bugs so fix them by yourself!


# Falcon
Falcon is an open-source client area for pterodactyl panel

### Features
Resource Management (Use it to create servers, gift them, etc)

Coins (AFK Page earning)

Servers (create, view, edit servers)

User System (auth, regen password, etc)

OAuth2 (Discord)

Store (buy resources with coins)

Dashboard (view resources & servers)

Admin (set, add, remove coins/scan eggs & locations)

Panel Support (Pterodactyl)

# Sponsors
Ko-fi sponsors are not working so come on our [discord](https://www.lynix.tech/discord/join)

# Installation

Warning: You need Pterodactyl already setup on a domain for falcon to work
1. Upload the file above onto a Pterodactyl NodeJS server [Download the egg from Parkervcp's GitHub Repository](https://github.com/parkervcp/eggs/blob/master/generic/nodejs/egg-node-js-generic.json)
2. Unarchive the file and set the server to use NodeJS 16
3. Configure `.env`, `/storage/eggs.json` & `/storage/plans.json` with the scan or manuel
4. Run `npm i`
5. Start the server with `node index.js`
6. Login to your DNS manager, point the domain you want your dashboard to be hosted on to your VPS IP address. (Example: dashboard.domain.com 192.168.0.1)
7. Run `apt install nginx && apt install certbot` on the vps
8. Run `ufw allow 80` and `ufw allow 443` on the vps
9. Run `certbot certonly -d <Your domain>` then do 1 and put your email
10. Run `nano /etc/nginx/sites-enabled/falcon.conf`
11. Paste the configuration at the bottom of this and replace with the IP of the pterodactyl server including the port and with the domain you want your dashboard to be hosted on.
12. Run `systemctl restart nginx` and try open your domain.

# Nginx Proxy Config
```Nginx
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name <domain>;

    ssl_certificate /etc/letsencrypt/live/<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    location /afkwspath {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://localhost:<port>/afkwspath;
    }

    location / {
        proxy_pass http://localhost:<port>/;
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

```

# Updating

1. Backup `database.sqlite` form your dashboard
2. Remove old dashboard
3. Install new dashboard
4. Run it and stop it
5. Then replace `database.sqlite` with your one


# License
(c) 2024 Symthoptic and contributors. All rights reserved. Licensed under the MIT License.

