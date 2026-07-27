# Database Migration & Backup Guide

This guide covers how to transfer the PostgreSQL database from the old VPS to the new VPS for the **Alyoum Plus** system.

## 1. Export Data from the Old VPS

Log into your **old VPS** via SSH and create a database dump from your running PostgreSQL container.

*(Note: Replace `<old-db-container-name>` with the actual name of your database container on the old server. You can find it by running `docker ps`)*

```bash
# Generate the backup file
docker exec -t <old-db-container-name> pg_dump -U alyoumplus -F c alyoumplus > db_backup.dump
```

## 2. Transfer the File to the New VPS

You need to move the `db_backup.dump` file from the old VPS to the new VPS. You can use `scp` to copy it directly from the old VPS to the new one.

Run this on the **old VPS**:
```bash
scp db_backup.dump root@203.161.58.28:~/alyoumplus.ly/
```
*(It will ask for your new VPS password or require your SSH keys)*

## 3. Import Data on the New VPS

Log into your **new VPS** (`203.161.58.28`) and navigate to the project directory where you transferred the file:

```bash
cd ~/alyoumplus.ly
```

Then, run this command to inject the data into your new database container:

```bash
docker exec -i alyoum-plus-db pg_restore -U alyoumplus -d alyoumplus -c < db_backup.dump
```
*(The `-c` flag ensures it drops the empty tables before importing the new ones to avoid duplicate key errors).*

## 4. Verify

Once the restore is complete, restart the web container just to make sure it loads all the fresh settings from the database:

```bash
docker compose restart web
```

Go to `http://203.161.58.28:3006` in your browser. The site should now load perfectly with all your data!
