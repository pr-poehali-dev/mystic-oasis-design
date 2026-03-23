"""Возвращает данные индекса Агро: текущее значение и историю за неделю, месяц, год и всё время."""

import json
import os
import psycopg2
from datetime import date


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    period = (event.get("queryStringParameters") or {}).get("period", "week")

    period_map = {
        "week": 7,
        "month": 30,
        "year": 365,
        "all": None,
    }

    if period not in period_map:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Invalid period"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Текущее значение (последняя запись)
    cur.execute("SELECT value, recorded_at FROM agro_index ORDER BY recorded_at DESC LIMIT 1")
    row = cur.fetchone()
    current_value = float(row[0]) if row else 0
    current_date = row[1].isoformat() if row else None

    # История за период
    days = period_map[period]
    if days:
        cur.execute(
            "SELECT recorded_at, value FROM agro_index WHERE recorded_at >= CURRENT_DATE - %s ORDER BY recorded_at ASC",
            (days,)
        )
    else:
        cur.execute("SELECT recorded_at, value FROM agro_index ORDER BY recorded_at ASC")

    rows = cur.fetchall()
    history = [{"date": r[0].isoformat(), "value": float(r[1])} for r in rows]

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({
            "current": {"value": current_value, "date": current_date},
            "history": history,
        }),
    }
