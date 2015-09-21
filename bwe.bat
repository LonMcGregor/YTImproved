@echo off
del "icons/Thumbs.db"
7z a -tzip ytimproved.xpi css/*
7z a -tzip ytimproved.xpi icons/*
7z a -tzip ytimproved.xpi scripts/*
7z a -tzip ytimproved.xpi manifest.json
