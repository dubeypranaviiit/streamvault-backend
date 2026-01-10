# 🎥 StreamVault Backend – Video Upload, Processing & Streaming API

This repository contains the **backend implementation** of StreamVault, a secure,
multi-tenant video upload and streaming system with real-time processing updates
and content sensitivity analysis.

Built according to the assignment requirements using **Node.js, Express, MongoDB,
Socket.IO, and Google Cloud Storage**.

---

## 📌 Core Features

### 🔐 Authentication & Security
- JWT-based authentication (Access + Refresh tokens)
- HTTP-only cookies
- Role-based authorization (Viewer, Editor, Admin)
- Secure tenant isolation

---

### 📤 Video Upload System
- Secure video uploads using Multer
- File type and size validation
- Cloud storage using Google Cloud Storage (GCS)
- Metadata stored in MongoDB

---

### 🛡️ Content Sensitivity Processing
- Background video processing pipeline
- Automatic sensitivity classification:
  - `safe`
  - `flagged`
- Processing status tracking stored in database
- Designed for future ML / cloud moderation integration

---

### 🔄 Real-Time Progress Updates
- Socket.IO based real-time communication
- User-scoped event rooms
- Live processing progress updates
- Completion notifications

---

### 📡 Secure Video Streaming
- HTTP range-based video streaming
- Chunked delivery (`206 Partial Content`)
- Streaming allowed only after processing completion
- Flagged content is blocked from streaming
- Strict tenant and role-based access checks

---

## 👥 Role-Based Access Control (RBAC)

| Role | Capabilities |
|----|-------------|
| Viewer | Stream assigned safe videos |
| Editor | Upload videos, edit own videos, stream content |
| Admin | Full access + user management |

---

## 🏗️ Backend Architecture

src/
├── config/ # DB, env, cookies, GCS
├── controllers/ # Business logic
├── middleware/ # Auth, RBAC, uploads
├── models/ # Mongoose schemas
├── routes/ # API endpoints
├── utils/ # Tokens, processing, storage



---

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development

MONGO_URL=your_mongodb_url

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json
GCP_PROJECT_ID=your_project_id
GCP_BUCKET_NAME=your_bucket_name

▶️ Running the Backend
npm install
npm run dev


Server runs on:

http://localhost:5000



🔁 Video Processing Workflow

1.Video upload request
2.File stored securely in GCS
3.Video metadata saved to MongoDB
4.Background processing begins
5.Real-time progress updates via Socket.IO
6.Sensitivity analysis performed
7.Video marked as safe or flagged
8.Streaming enabled only for safe content

🔮 Future Enhancements

1.AI-based video moderation (Google Video Intelligence / AWS Rekognition)
2.Video transcoding (HLS / DASH)
3.Admin approval workflow for flagged videos
4.Rate limiting & audit logs