## Project Documentation: **Streaum**

### 1. 📌 Overview

**Streaum** is a real-time group communication platform inspired by Discord. It allows users to:
- Register and log in securely
- Create and join servers
- Create text and voice channels
- Send real-time messages in text channels
- Invite others via shareable links with configurable roles and expiry

The system is built as a **mobile-first application** with a **Java backend**, using modern development and deployment practices.

---

### 2. 🧱 Architecture

Streaum follows a **client-server architecture** with the following components:

| Layer | Technology |
|------|------------|
| **Frontend** | React Native (Expo), TypeScript, Tailwind CSS (via Nativewind) |
| **Backend** | Java 21, Jakarta EE, Hibernate ORM, Tomcat 9 |
| **Database** | MySQL 8+ |
| **API** | RESTful endpoints (JSON over HTTP) |
| **Real-time** | WebSocket (Jakarta WebSocket API) |
| **Auth** | JWT (JSON Web Tokens) |
| **File Storage** | Local filesystem (configurable via `.env`) |
| **Build & Deploy** | Maven, Docker, GitHub Actions |

> 🔗 **Communication Flow**:  
> Mobile App → REST API (login, servers, channels) → WebSocket (real-time chat) → MySQL (data persistence)

---

### 3. 📱 Frontend (Mobile App)

#### Tech Stack
- **Framework**: React Native (managed workflow via Expo SDK 54)
- **Navigation**: `@react-navigation/native-stack`
- **Styling**: Tailwind CSS with `nativewind`
- **State & Storage**: `AsyncStorage` for JWT token persistence
- **HTTP Client**: `axios`
- **UI Components**: Custom buttons, inputs, and layouts with responsive design
- **Media**: `expo-image-picker` for server avatars

#### Key Features Implemented
- User registration & login with validation
- Server creation with optional image upload
- Joining servers via invitation ID
- Channel creation (text/voice)
- Real-time chat in text channels (WebSocket)
- Role-based access (Creator, Admin, Member)

---

### 4. ⚙️ Backend (Java Web Application)

#### Core Technologies
- **Runtime**: Java 21
- **Web Container**: Apache Tomcat 9 (supports `javax.servlet` APIs)
- **ORM**: Hibernate 5.6.0.Final *(Note: You also declared Hibernate ORM 7.0.0.Beta1 — see **Known Issues**)*
- **Database Driver**: MySQL Connector/J 9.4.0
- **JSON Handling**: Google Gson 2.13.2
- **Authentication**: Auth0 Java JWT 4.5.0
- **Environment**: `dotenv-kotlin` for `.env` support
- **WebSocket**: Jakarta WebSocket API 2.2.0 + Tomcat WebSocket

#### API Endpoints (Selected)
| Method | Endpoint | Purpose |
|-------|--------|--------|
| POST | `/register` | Create new user |
| POST | `/login` | Authenticate and return JWT |
| POST | `/create-server` | Create a new server |
| GET/POST | `/my-servers` | List or fetch server details |
| POST | `/channels` | Create a channel in a server |
| POST | `/server-invitation` | Generate invite link |
| GET | `/server-invitation?id=...` | Join server via invite |
| GET | `/text-channel-history` | Load message history |
| POST | `/upload` | Upload server image |
| GET | `/files/{filename}` | Serve uploaded files |

#### WebSocket
- **Endpoint**: `ws://<host>/chat/{serverId}/{channelId}/{token}`
- Broadcasts messages to all connected clients in the same channel
- Validates JWT and user membership on connection

---

### 5. 🗄️ Database Design

#### Entities
- `User`: Stores user credentials and profile
- `Server`: Represents a chat server
- `UserHasServers`: Junction table with `MemberType` (CREATOR/ADMIN/MEMBER)
- `Channel`: Belongs to a server; type = TEXT or VOICE
- `TextChannelHistory`: Stores message logs
- `ServerInvitation`: Time-limited invite links with role assignment

> All entities use **UUIDs for server/invitation IDs** and **auto-increment for user/channel IDs**.

---

### 6. 🐳 DevOps & Deployment

#### Docker
- **Backend**: Multi-stage Dockerfile
    - Build stage: Maven + JDK 21
    - Runtime: Tomcat 9 with WAR deployed as `ROOT.war`
- **Frontend**: Dockerfile for Android/iOS build (used in CI)

#### GitHub Actions
- **Backend CI**: `backend-docker-ci.yml`
    - Builds Docker image
    - Runs container on port 8080
    - Performs smoke test on root endpoint
- **Mobile CI**: `mobile-app-docker-ci.yml`
    - Builds Android APK/AAB on tag push
    - Publishes release artifacts

#### Environment Configuration
- Uses `.env` file (via `dotenv-kotlin`)
- Required variables:
  ```env
  JWT_SECRET=your_strong_secret_here
  UPLOAD_PATH=/path/to/upload/directory
  ```

---

### 7. 🛠️ Known Issues & Improvements

#### ⚠️ Dependency Conflict
Your `pom.xml` includes **two versions of Hibernate**:
```xml
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>7.0.0.Beta1</version>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>5.6.0.Final</version>
</dependency>
```
➡️ **Recommendation**: Remove the older `5.6.0.Final` version to avoid classpath conflicts.

#### 📦 MySQL Connector Version
You’re using `mysql-connector-j:9.4.0`, but the latest stable version listed on Maven Central is **9.2.0** (as of Jan 2025).  
➡️ Consider downgrading to **9.2.0** for stability unless you require bleeding-edge features.

#### 🔐 Security Notes
- Passwords are hashed with **SHA-256** (no salt). For production, use **bcrypt** or **PBKDF2**.
- File uploads are saved to disk — ensure proper sanitization and size limits.
- WebSocket validates JWT but doesn’t handle reconnection or presence.

---

### 8. ▶️ How to Run Locally

#### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Java 21 + Maven
- MySQL server

#### Steps
1. **Set up backend**:
   ```bash
   cp src/main/resources/.env.example src/main/resources/.env
   # Edit .env with your JWT_SECRET and UPLOAD_PATH
   mvn clean package
   docker build -t streaum .
   docker run -p 8080:8080 streaum
   ```
2. **Set up mobile app**:
   ```bash
   cd mobile-app
   cp .env.example .env
   # Set EXPO_PUBLIC_API_URL=http://<your-ip>:8080
   npm install
   npm start
   ```

> 💡 Use your machine’s local IP (not `localhost`) for mobile device connectivity.

---

### 9. 📚 References

- [Expo Documentation](https://docs.expo.dev/)
- [Hibernate ORM](https://hibernate.org/orm/)
- [Jakarta EE](https://jakarta.ee/)
- [Auth0 JWT Library](https://github.com/auth0/java-jwt)
- [MySQL Connector/J](https://dev.mysql.com/doc/connector-j/en/)

---

Let me know if you'd like:
- A **PDF version** of this
- **Diagrams** (architecture, ERD, sequence)
- **API specification** (OpenAPI/Swagger)
- **User manual** for testers

Good luck with your assignment! 🎓