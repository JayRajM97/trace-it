# Trace It

Trace It is a full-stack mobile application that allows users to draw, record, and track shapes and routes on a map. Built as an Expo React Native application with a robust Express backend API, users can go out and run, walk, or cycle to trace distinct shapes in the real world, calculate their fidelity score, and share their routes!

## 🚀 Features

- **Route Tracking**: Record your real-world path on the map with high precision.
- **Shape Tracing & Fidelity Scoring**: Attempt to trace predetermined shapes (e.g., circles, squares, customized paths) and get a "Fidelity Score" based on how accurately your real-world activity matched the intended shape.
- **Strava Integration**: Seamlessly sync your traced routes and activities via Strava.
- **Social Sharing**: Generate dynamic image previews (powered by Satori) of your recorded routes and share them with the community.
- **Route History**: Save and view your past activities and their generated shapes.

## 🛠 Tech Stack

This project is structured as a **PNPM Monorepo** and leverages modern tools:

### Mobile App (`artifacts/mobile`)
- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Authentication**: [Clerk Expo](https://clerk.dev/)
- **Maps**: `react-native-maps`
- **Data Fetching**: React Query with typed API clients.

### Backend API (`artifacts/api-server`)
- **Framework**: [Express.js](https://expressjs.com/) built with TypeScript
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) layer (`lib/db`)
- **Authentication/Webhooks**: Clerk Node SDK & Svix
- **Image Generation**: Satori & Resvg (for dynamic route-share thumbnails)

### Shared Libraries (`lib/`)
- **`api-zod`**: Shared Zod schemas to enforce end-to-end type safety between the mobile app and backend.
- **`api-client-react`**: A custom React Query fetch client generated from our API specs.
- **`db`**: Centralized database schemas and migrations.

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v20+)
- [PNPM](https://pnpm.io/) (v9+)
- A PostgreSQL Database
- Clerk, Strava, and other configured environmental API keys.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/trace-it.git
   cd trace-it
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   - Copy `.env.example` to `.env` in both the `artifacts/api-server` and `artifacts/mobile` directories and fill in the required keys (e.g., Clerk publishable keys, database connection strings, Strava Client secrets).

4. **Run the Development Servers:**
   At the root of the project, you can run the following commands:
   
   - **Start the API Server:**
     ```bash
     pnpm run dev:api
     ```
   - **Start the Mobile Expo App:**
     ```bash
     pnpm run dev:mobile
     ```

## 🤝 Contributing

Pull requests and issues are welcome! Feel free to open an issue or submit a PR for any features, bug fixes, or documentation improvements.

## 📝 License

This project is open-source and free to use.
