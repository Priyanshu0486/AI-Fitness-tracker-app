# 🏋️ AI Fitness Tracker

A full-stack **microservices-based fitness tracking application** with **AI-powered workout recommendations** using Google's Gemini API. Built with Spring Boot, React, and secured with Keycloak OAuth2.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=spring-boot)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?logo=rabbitmq&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-4D4D4D?logo=keycloak&logoColor=white)

---

## 📌 Overview

Users can log fitness activities (running, walking, cycling), and the system asynchronously generates **AI-powered recommendations** including performance analysis, improvement areas, workout suggestions, and safety guidelines — all powered by **Google Gemini 2.0 Flash**.

### Key Features

- 🔐 **OAuth2 Authentication** — Keycloak with PKCE flow for secure login/logout
- 📊 **Activity Tracking** — Log, view, and delete fitness activities
- 🤖 **AI Recommendations** — Automated analysis via Gemini API, delivered asynchronously through RabbitMQ
- 🌐 **Microservices Architecture** — 5 independently deployable services with service discovery & centralized config
- 🎨 **Modern Dark UI** — React frontend with Material UI, smooth animations, and responsive design

---

## 🏗️ Architecture

```
┌──────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   React App  │──────▶│   API Gateway    │──────▶│  User Service   │
│  (Vite + MUI)│       │  (Spring Cloud)  │       │  (PostgreSQL)   │
└──────────────┘       │    Port: 8080    │       │  Port: 8081     │
       │               └──────────────────┘       └─────────────────┘
       │                        │
       ▼                        ├──────────────▶┌─────────────────────┐
┌──────────────┐                │               │  Activity Service   │
│   Keycloak   │                │               │  (MongoDB)          │
│  Port: 8181  │                │               │  Port: 8082         │
└──────────────┘                │               └────────┬────────────┘
                                │                        │ RabbitMQ
                                │                        ▼
                                ├──────────────▶┌─────────────────────┐
                                │               │   AI Service        │
                                │               │  (MongoDB + Gemini) │
                                │               │  Port: 8083         │
                                │               └─────────────────────┘
                                │
                       ┌────────┴────────┐    ┌───────────────────┐
                       │  Eureka Server  │    │  Config Server    │
                       │  Port: 8761     │    │  Port: 8888       │
                       └─────────────────┘    └───────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 21** | Core language |
| **Spring Boot 3.x** | Microservice framework |
| **Spring Cloud Gateway** | API Gateway & routing |
| **Spring Cloud Config** | Centralized configuration |
| **Netflix Eureka** | Service discovery & registration |
| **Spring Data MongoDB** | Activity & recommendation persistence |
| **Spring Data JPA** | User persistence (PostgreSQL) |
| **Spring AMQP (RabbitMQ)** | Asynchronous messaging between services |
| **Spring WebFlux (WebClient)** | Non-blocking HTTP client for Gemini API |
| **Spring Security OAuth2** | JWT-based resource server security |
| **Keycloak** | Identity & access management (OAuth2 + PKCE) |
| **Google Gemini API** | AI-powered fitness recommendations |
| **Lombok** | Boilerplate reduction |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Material UI (MUI) v7** | Component library |
| **React Router DOM v7** | Client-side routing |
| **Redux Toolkit** | Global state management |
| **Axios** | HTTP client with interceptors |
| **react-oauth2-code-pkce** | OAuth2 PKCE authentication flow |

### Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL database (activities, recommendations) |
| **PostgreSQL** | Relational database (users) |
| **RabbitMQ** | Message broker (async AI processing) |
| **Keycloak** | OAuth2 / OpenID Connect identity provider |

---

## 📁 Project Structure

```
AI-fitness-tracker/
├── config-server/          # Centralized configuration (Port: 8888)
├── eureka/                 # Service discovery server (Port: 8761)
├── gateway/                # API Gateway (Port: 8080)
├── user-service/           # User management - PostgreSQL (Port: 8081)
├── activity-service/       # Activity CRUD - MongoDB + RabbitMQ (Port: 8082)
├── ai-service/             # AI recommendations - MongoDB + Gemini (Port: 8083)
└── fitness-app-frontend/   # React frontend (Port: 5173)
```

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- MongoDB (running on `localhost:27017`)
- PostgreSQL (running on `localhost:5433`)
- RabbitMQ (running on `localhost:5672`)
- Keycloak (running on `localhost:8181`)
- Google Gemini API Key ([Get one here](https://ai.google.dev/))

### 1. Set Environment Variables

```bash
export GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=
export GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Configure Keycloak

1. Create a realm named `fitness-oauth2`
2. Create a client named `oauth2-pkce-client` with:
   - Client authentication: OFF
   - Standard flow: ON
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
3. Create a test user with credentials

### 3. Start Backend Services (in order)

```bash
# 1. Config Server
cd config-server && mvn spring-boot:run

# 2. Eureka Server
cd eureka && mvn spring-boot:run

# 3. API Gateway
cd gateway && mvn spring-boot:run

# 4. User Service
cd user-service && mvn spring-boot:run

# 5. Activity Service
cd activity-service && mvn spring-boot:run

# 6. AI Service
cd ai-service && mvn spring-boot:run
```

### 4. Start Frontend

```bash
cd fitness-app-frontend
npm install
npm run dev
```

### 5. Open the app

Navigate to `http://localhost:5173` and sign in with your Keycloak credentials.

---

## 📡 API Endpoints

### Activity Service (`/api/activities`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/activities` | Log a new activity |
| `GET` | `/api/activities` | Get all activities for user |
| `GET` | `/api/activities/{id}` | Get activity by ID |
| `DELETE` | `/api/activities/{id}` | Delete an activity |

### AI Service (`/api/recommendations`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recommendations/activity/{id}` | Get AI recommendation for an activity |
| `GET` | `/api/recommendations/user/{userId}` | Get all recommendations for a user |

### User Service (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/register` | Register a new user |
| `GET` | `/api/users/{userId}` | Validate user exists |

---

## 🔄 How It Works

1. **User logs in** via Keycloak OAuth2 PKCE flow
2. **User creates an activity** (type, duration, calories burned)
3. **Activity Service** saves it to MongoDB and publishes a message to **RabbitMQ**
4. **AI Service** picks up the message, sends the activity data to **Google Gemini API**
5. Gemini generates a structured JSON response with analysis, improvements, suggestions, and safety tips
6. **AI Service** parses the response and saves the recommendation to MongoDB
7. **User views the activity details** — the frontend fetches both the activity and its AI recommendation

```
User → Frontend → Gateway → Activity Service → MongoDB
                                    ↓
                              RabbitMQ (async)
                                    ↓
                             AI Service → Gemini API
                                    ↓
                             MongoDB (recommendations)
```

---

## 🖥️ Screenshots

### Activities Page
> Dark-themed dashboard with activity logging form and activity cards with hover animations

### Activity Details
> Detailed view with stats cards (type, duration, calories), AI-generated analysis, improvements, workout suggestions, and safety guidelines

---

## 🧠 AI Recommendation Sample

When the Gemini API quota is available, each activity gets a detailed recommendation:

```json
{
  "analysis": {
    "overall": "Good 30-minute running session with moderate calorie burn",
    "pace": "Maintaining a steady pace suitable for endurance building",
    "heartRate": "Heart rate likely in moderate zone",
    "caloriesBurned": "300 kcal is appropriate for this duration"
  },
  "improvements": [
    { "area": "Endurance", "recommendation": "Gradually increase duration by 5 min/week" }
  ],
  "suggestions": [
    { "workout": "Interval Training", "description": "Alternate between sprinting and jogging" }
  ],
  "safety": [
    "Warm up for 5 minutes before running",
    "Stay hydrated throughout the session"
  ]
}
```

---

## ⚙️ Service Ports

| Service | Port |
|---|---|
| Config Server | 8888 |
| Eureka Server | 8761 |
| API Gateway | 8080 |
| User Service | 8081 |
| Activity Service | 8082 |
| AI Service | 8083 |
| Keycloak | 8181 |
| Frontend (Vite) | 5173 |
| MongoDB | 27017 |
| PostgreSQL | 5433 |
| RabbitMQ | 5672 |

---

## 📝 License

This project is for educational and portfolio purposes.

---

## 👤 Author

**Priyanshu Pal**

---

*Built with ❤️ using Spring Boot Microservices, React, and Google Gemini AI*
