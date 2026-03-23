"""Админка Агро Индекс: авторизация по паролю и добавление нового значения индекса."""

import json
import os
import psycopg2


HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    # Авторизация
    if action == "login":
        password = body.get("password", "")
        if password == os.environ["ADMIN_PASSWORD"]:
            return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True})}
        return {"statusCode": 401, "headers": HEADERS, "body": json.dumps({"ok": False, "error": "Неверный пароль"})}

    # Добавление нового значения индекса
    if action == "add":
        password = body.get("password", "")
        if password != os.environ["ADMIN_PASSWORD"]:
            return {"statusCode": 401, "headers": HEADERS, "body": json.dumps({"error": "Не авторизован"})}

        value = body.get("value")
        date = body.get("date")

        if value is None or date is None:
            return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "Нужны value и date"})}

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO agro_index (value, recorded_at)
            VALUES (%s, %s)
            ON CONFLICT (recorded_at) DO UPDATE SET value = EXCLUDED.value
            """,
            (value, date),
        )
        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True})}

    return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "Неизвестный action"})}
