# LMS API (Express + MongoDB)

A simple Learning Management System (LMS) backend built with **Node.js, Express, and MongoDB Atlas**.  
It supports **user authentication**, **course management**, **assignments**, and **submissions**, and was created as part of the COMP229 / Project Part 2 – First Release.

---

## Overview

This project provides a RESTful API for an LMS scenario:

- instructors can create courses and publish assignments
- students can submit work
- all sensitive actions are protected by authentication (JWT + httpOnly cookie)

This repository contains the **backend** part. A simple frontend (React/Vite) can consume these endpoints.

---

## Features

- User registration, login, logout
- Get current user (`/api/auth/me`)
- Course CRUD (`/api/courses`)
- Assignment CRUD (`/api/assignments`)
- Submission CRUD (`/api/submissions`)
- Protected routes with middleware (`requireAuth`)
- MongoDB Atlas connection
- Thunder/Postman friendly JSON APIs

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT (stored in httpOnly cookie)
- **Tools:** Thunder Client / Postman
- **Package manager:** yarn / npm

---

## Project Structure

```text
.
├── server.js
└── server
    ├── config
    │   └── db.js
    ├── models
    │   ├── User.js
    │   ├── Course.js
    │   ├── Assignment.js
    │   └── Submission.js
    ├── controllers
    │   ├── authController.js
    │   ├── courseController.js
    │   ├── assignmentController.js
    │   └── submissionController.js
    ├── routes
    │   ├── authRoutes.js
    │   ├── courseRoutes.js
    │   ├── assignmentRoutes.js
    │   └── submissionRoutes.js
    └── middleware
        └── requireAuth.js
