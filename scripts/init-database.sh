#!/bin/sh

PGPASSWORD="website" psql -d website -U website -f /sql/reviews.sql
