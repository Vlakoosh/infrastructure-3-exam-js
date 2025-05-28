# **Infrastructure 3 Project: Setup and Hosting**



---

## **Project Description**

- "Mood Board" application where users can enter their name and how they feel
- Real time updates of the web app with websockets
- Stores everything in a database
- Uses a real domain with HTTPS encryption

---

## **What's Inside**

| Container     | What it does                                            |
|---------------|---------------------------------------------------------|
| `sz-postgres` | PostgreSQL database - stores data                       |
| `sz-express`  | Express.js backend - handles requests                   |
| `sz-caddy`    | Caddy reverse proxy - gives you HTTPS and domain access |

---

## how to run:

### Step 0: Install Docker & Docker Compose (Required!)

Before running anything, make sure your VM or local machine has:

- [Docker installed](https://docs.docker.com/desktop/setup/install/linux/)
- [Docker Compose V2 installed](https://docs.docker.com/compose/install/linux/)

### Step 1: Clone this repository

```bash
git clone https://github.com/Vlakoosh/infrastructure-3-exam-js
cd infrastructure-3-exam-js
```

### Step 2: Copy the example environment config

```bash
cp .env.example .env
```

### Step 3: Open `.env` and put in your DuckDNS info

You’ll need a **DuckDNS subdomain**

Go to: [https://www.duckdns.org/](https://www.duckdns.org/)

Register there, then enter your chosen subdomain. Then set the ip address of the subdomain to your machine's public ipv4 address

```bash
vim .env
```

While in the vim editor, press `I` on your keyboard to go into insert mode. There you can use your keyboard to type and arrow keys to navigate.

Change your values:
```
PGHOST=   //should be the name of your database container in docker-compose.yml
PGPORT=5432

POSTGRES_USER=      //postgres db username
POSTGRES_PASSWORD=  //postgres db password
POSTGRES_DB=        //which db to use in postgres

DUCKDNS_DOMAIN=     //your duckdns subdomain
CADDY_EMAIL=        //email for your ssl certificate
```

When you're done editing the file, press the `Esc` key once. Then type `:wq` and press `Enter`. This will save the changes `(w)` and quit `(q)`

### Step 4: Start Everything

```bash
docker compose up -d --build
```

This will:

- Start all services
- Connect everything
- Automatically set up ssl and https!

### Step 5: Open Your Website

In your browser go to:

```
https://yoursubdomain.duckdns.org
```
---



## **Test Locally with 127.0.0.1**

If you don’t have a public IP or want to simulate your setup locally:


go back to ```https://www.duckdns.org``` and change the subdomain ip address to `127.0.0.1`


Then rebuild your docker-compose and open:

```
https://yoursubdomain.duckdns.org
```

It will point to your own machine!

---

## **Stopping & Cleaning Up**

### Stop all services

```bash
docker compose down
```

### Clean unused Docker resources

```bash
docker system prune -a
```

---

## **Logs & Troubleshooting**

### See logs for a service

```bash
docker logs container-name
```



