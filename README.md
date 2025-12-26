# Create and run containers

You can run the project in two different ways, depending on whether you want everything in a single setup or split services.

## 🔹 Option 1: Run Everything (All-in-One)

This option starts frontend, backend, and database together.

docker compose up --build -d

📁 Run this command from the root folder of the project.

## 🔹 Option 2: Run Frontend and Backend Separately

You can run each part in its own container stack.

### Frontend (Angular)
cd angular-frontend

docker compose up --build -d


### Backend (Laravel)
cd laravel-backend


docker compose up --build -d
