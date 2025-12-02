# BitQuery API Authorization Guide

This document explains how to correctly authenticate with the **new BitQuery API v2 system**, why keys now start with `ory_at_`, and how to update all backend and Python engine code to prevent **401 Unauthorized** errors.

Use this as the reference for fixing the BitQuery integration.

---

# 1. BitQuery Now Uses ORY Access Tokens

BitQuery has updated their authentication system. Your API key now looks like this:

```
ory_at_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

This **is correct**.

These ORY tokens **replace** the old API keys that started with `BQY` or `BQYV2`.

BitQuery's own documentation shows the same format:

> **Authorization: Bearer ory_at_...**

Therefore, the token starting with `ory_at_` is valid and is your real BitQuery API key.

---

# 2. Important: BitQuery No Longer Uses `X-API-KEY`

The old authentication header:

```
X-API-KEY: <key>
```

**NO LONGER WORKS**.

If you use `X-API-KEY`, BitQuery will always return:

```
401 Unauthorized
```

---

# 3. Correct Authentication Header (New Method)

All calls to the BitQuery API must now use:

```
Authorization: Bearer <YOUR_TOKEN>
```

### Correct Python header:

```python
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
```

### Wrong (outdated and causes 401):

```python
headers = {
    "X-API-KEY": api_key
}
```

Any code still using `X-API-KEY` must be updated.

---

# 4. How to Test if the Key Works

Run this command in terminal:

```
curl -H "Authorization: Bearer $BITQUERY_API_KEY" \
https://graphql.bitquery.io
```

Expected responses:

* `200` → Key valid
* `401` → Header incorrect (not using Bearer)
* `402` → Plan does not allow the query

---

# 5. Why You May Still See `401 Unauthorized`

Even with the correct key, these issues can still cause 401:

### 1. Using old header (`X-API-KEY`) → fix with Bearer

### 2. Python engine environment variable not exported correctly

Use:

```
export BITQUERY_API_KEY="ory_at_..."
```

### 3. The Python engine or backend is constructing the request incorrectly

Update all request code to use the new header.

---

# 6. Required Fix in the Python Accumulation Engine

Update request code from:

```python
headers = {"X-API-KEY": os.environ["BITQUERY_API_KEY"]}
```

to:

```python
headers = {
    "Authorization": f"Bearer {os.environ['BITQUERY_API_KEY']}",
    "Content-Type": "application/json",
}
```

This change must be applied to **every** BitQuery request.

---

# 7. Required Fix in Backend (if applicable)

If the backend also queries BitQuery, update headers similarly.

### Correct:

```ts
headers: {
  Authorization: `Bearer ${process.env.BITQUERY_API_KEY}`,
  "Content-Type": "application/json",
},
```

### Incorrect:

```ts
headers: {
  "X-API-KEY": process.env.BITQUERY_API_KEY,
},
```

---

# 8. Summary

| Issue                         | Solution                               |
| ----------------------------- | -------------------------------------- |
| API key starts with `ory_at_` | **Correct key** (new system)           |
| Using `X-API-KEY` header      | **Replace with Authorization: Bearer** |
| Getting 401 Unauthorized      | Use correct header + export token      |
| Python engine failing         | Update request header code             |

---

# 9. Instructions to Cursor

Use the following instructions in Cursor:

```
BitQuery has migrated to ORY tokens. The API key starts with `ory_at_`, which is correct.

Please update all BitQuery request code (Python and backend) so that
ALL requests use:

Authorization: Bearer <BITQUERY_API_KEY>

Instead of the old header:
X-API-KEY

Update the accumulation engine and any backend service making BitQuery calls accordingly.
```

---

# End of BitQuery.md
