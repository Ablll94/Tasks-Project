# Tasks-Project

نظام إدارة المهام والتنبيهات — غرفة المدينة المنورة (Madinah Chamber)
Task assignment and notification system with an Express + MongoDB API and a React (Vite) frontend.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB (Atlas or local) |
| Frontend | React 18, Vite 5, Axios |
| Auth | None — users are identified by a plain `userId` string |

## Project Structure

```
.
├── backend/
│   ├── config/db.js            # Mongoose connection with retry logic
│   ├── controllers/            # adminController.js, userController.js
│   ├── middleware/errorHandler.js
│   ├── models/                 # Task.js, Notification.js
│   ├── routes/                 # adminRoutes.js, userRoutes.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                # axios client + endpoint wrappers
│   │   ├── components/         # AdminDashboard, UserTasks, NotificationCenter
│   │   ├── pages/Pages.jsx
│   │   └── App.jsx
│   ├── vite.config.js
│   └── .env
└── .gitignore
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env      # macOS / Linux
copy .env.example .env    # Windows
```

Set your connection string in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

For a local MongoDB instead of Atlas:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task_db?directConnection=true
```

Start the server:

```bash
npm run dev     # nodemon, restarts on change
npm start       # plain node
```

The server listens on `0.0.0.0:5000`. On start you should see:

```
Server running on port 5000
MongoDB Connected: <your-host>
```

Verify it responds:

```bash
curl http://localhost:5000/api/health
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Use the toggle in the header to switch between the **admin** and **user** views.

For a production bundle:

```bash
npm run build     # outputs to frontend/dist
npm run preview
```

## API Reference

Base URL: `http://localhost:5000/api`

### Admin

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/admin/tasks` | `{ title, description, assignedTo, deadline }` | Create a task and notify the assignee |
| `POST` | `/admin/notifications/info` | `{ userId, message }` | Send a broadcast notice to one user |
| `POST` | `/admin/check-overdue` | — | Flag past-deadline tasks as `overdue` and notify assignees |

### User

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/user/tasks/:userId` | List tasks assigned to a user |
| `PUT` | `/user/tasks/:id/complete` | Mark a task `completed` and notify the assignee |
| `GET` | `/user/notifications/:userId` | Unread notifications, newest first |
| `PUT` | `/user/notifications/:id/read` | Mark a notification as read |

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness check |

## Data Models

**Task** — `backend/models/Task.js`

| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | required |
| `description` | String | optional |
| `assignedTo` | String | required — the user ID |
| `deadline` | Date | required |
| `status` | String | `pending` \| `completed` \| `overdue`, defaults to `pending` |

**Notification** — `backend/models/Notification.js`

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | String | required — recipient |
| `message` | String | required |
| `type` | String | `NEW_TASK` \| `TASK_COMPLETED` \| `TASK_OVERDUE` \| `INFO` |
| `taskId` | ObjectId | ref to `Task`, optional |
| `isRead` | Boolean | defaults to `false` |

## Notes and Limitations

- There is **no authentication layer**. The `userId` is typed directly into the UI and sent as a URL parameter, so any user can read another user's tasks or notifications. Add auth before deploying this anywhere public.
- Users are matched by **exact string equality** on `assignedTo` / `userId`. There is no partial or fuzzy search, and no normalisation of case or whitespace (the UI trims input before sending).
- Notification polling runs every 4 seconds per mounted `NotificationCenter` rather than using WebSockets or server-sent events.
- `frontend/.env` sets `VITE_API_URL`, but the components currently call `http://localhost:5000` directly, which means the Vite proxy in `vite.config.js` is unused. Switch the components to the shared `api` client in `frontend/src/api/client.js` if you want the proxy to take effect.

## Troubleshooting

**`MongooseServerSelectionError` / `MongoDB Connection Error`**

The retry loop in `config/db.js` logs the failure and retries, so this usually means the URI, credentials, or IP access list is wrong. Verify:

- The username and password in `MONGO_URI` are correct and URL-encoded (a literal `@` or `/` in a password must be percent-encoded).
- Your current IP is allowlisted in Atlas under **Network Access**.
- From the machine running the backend: `node -e "require('dns').lookup('cluster0.xxxxx.mongodb.net', console.log)"` should resolve.

**`ECONNREFUSED` or connection failures from the browser**

On Windows, `localhost` resolves to `::1` first. If the browser requests `http://localhost:5000` over IPv6 while Node is bound to IPv4, the connection can fail. Either use `http://127.0.0.1:5000` in the client, or bind the server to all interfaces:

```js
app.listen(PORT, '0.0.0.0', () => { ... });
```

## Security Notes

- `.env` files and `env.bak` are excluded by `.gitignore`. Never commit real credentials.
- If a database password was ever committed, rotate it in Atlas and rewrite the history — deleting the file in a later commit is not enough.

## License

MIT