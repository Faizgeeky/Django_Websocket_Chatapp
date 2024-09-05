
# Django-React-Realtime-Chat-APP 
 Django -React realtime chat web application using Websocket

### This repository contains a Django WebSocket server and a React client for a real-time chat application.

###  Features

- **Authentication**: Users can log in using JWT (JSON Web Tokens) for secure authentication.
- **Send Interest**: Users can send interest requests to other users.
- **Accept/Reject Interest**: Users can accept or reject interest requests.
- **Real-time Chat**: Users can chat in real time with users who have accepted their interest.
- **Dashboard**: View and manage pending and accepted users from a dashboard.


### Demonstration Video

* Watch the demonstration video below to see the application in action:


https://github.com/user-attachments/assets/3f52e550-260a-413d-a181-5efa7d5f4dc8




## Setup Instructions

### Clone the Repository

To get started, clone the repository to your local machine:

```sh
git clone https://github.com/Faizgeeky/Django_RealTime_ChatApp.git
cd Faiz-Z_Tech-Task
```

### Setting Up the Django WebSocket Server

1. Navigate to the `server` folder:
    ```sh
    cd server
    ```

2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

3. Run the Daphne server:
    ```sh
    daphne -p 8000 server.asgi:application
    ```

### Setting Up the React Client

1. Navigate to the `client` folder:
    ```sh
    cd ../client
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Start the React application:
    ```sh
    npm start
    ```

### How the Application Works

This project uses Django Rest Framework (DRF) APIs and Django Channels to build a real-time chat application. 

### Postman Collection

A `API.postman_collection.json` file is included for easy testing of the API endpoints with Postman. Simply import this file into Postman to get started.

