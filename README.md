# This repo is an incubator for seamlessly integrating our ideas and publishing public facing versions. We will continue to improve and add more functionalities and tools as time goes

---

# PayTrack - Your Personal Finance Dashboard

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![Supabase](https://img.shields.io/badge/supabase-181818.svg?style=for-the-badge&logo=supabase&logoColor=3ECF8E)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

PayTrack is a modern, full-stack web application designed to help you take control of your finances. Track your income and expenses, set monthly budgets, and visualize your financial habits with clear, insightful reports. This entire application was bootstrapped using **MetaGPT**, showcasing the power of AI-driven development to rapidly build production-ready software.

![image](https://github.com/user-attachments/assets/182db816-7d2d-47ea-a37a-8686b48379f2)


## Key Features

*   **Secure User Authentication:** Sign up and log in securely, powered by Supabase Auth.
*   **Intuitive Dashboard:** Get an at-a-glance summary of your monthly income, expenses, balance, and recent transactions.
*   **Comprehensive Transaction Management:** Full CRUD (Create, Read, Update, Delete) functionality for all your income and expense transactions.
*   **Customizable Categories:** Create and manage personalized categories for both income and expenses to organize your finances precisely.
*   **Effective Budget Planning:** Set monthly budgets for different expense categories and visually track your spending against them.
*   **Insightful Financial Reports:** Visualize your financial data with dynamic charts showing monthly spending breakdowns, top spending categories, and savings progress.
*   **Fully Responsive Design:** A clean, modern UI that works beautifully on both desktop and mobile devices.

## Technology Stack

This project leverages a modern, robust technology stack to deliver a high-quality user experience.

*   **Frontend:**
    *   [**React**](https://reactjs.org/): A JavaScript library for building user interfaces.
    *   [**Vite**](https://vitejs.dev/): A next-generation frontend tooling for fast development.
    *   [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
    *   [**React Router**](https://reactrouter.com/): For client-side routing.
    *   [**Recharts**](https://recharts.org/): A composable charting library for React.

*   **Backend (Powered by Supabase):**
    *   [**Supabase**](https://supabase.io/): The open-source Firebase alternative.
    *   **Database:** Supabase-hosted PostgreSQL.
    *   **Authentication:** Supabase Auth for managing users.
    *   **APIs:** Auto-generated, secure APIs provided by Supabase.

## Getting Started: Installation & Setup

Follow these steps to get a local copy of PayTrack up and running on your machine.

### Prerequisites

*   **Node.js:** Make sure you have Node.js (v16 or higher) and npm/yarn installed.
*   **Supabase Account:** You will need a free Supabase account. [Create one here](https://supabase.com/).

### 1. Clone the Repository

```bash
git clone https://github.com/PolymathCorp/cocoon.git
cd paytrack
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Your Supabase Backend

1.  **Create a New Supabase Project:**
    *   Go to your [Supabase Dashboard](https://app.supabase.io/) and click "New project".
    *   Give your project a name (e.g., "PayTrack") and create a secure database password.

2.  **Set Up Environment Variables:**
    *   In the root of your cloned project, create a file named `.env`.
    *   Copy the contents of `.env.example` into `.env`.
    *   In your Supabase project, go to **Project Settings** > **API**.
    *   Copy the **Project URL** and the **anon (public) API Key**.
    *   Paste these values into your `.env` file:
        ```env
        VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
        VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"
        ```

3.  **Create the Database Schema:**
    *   In your Supabase project, navigate to the **SQL Editor** from the sidebar.
    *   Click "+ New query".
    *   Copy the entire SQL script from the `schema.sql` file in this repository and paste it into the editor.
    *   Click **"RUN"**. This will create the `categories`, `transactions`, and `budgets` tables and set up the necessary security policies.

### 4. Run the Application

Now that your environment is configured, you can start the development server.

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal). You should see the PayTrack login page.

## Project Structure

The project follows a standard React application structure to keep the codebase organized and maintainable.

```
/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components (Button, Card, Input)
│   ├── context/          # React context for state management (e.g., Auth)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Top-level page components (Dashboard, Login, etc.)
│   ├── services/         # Logic for interacting with the Supabase API
│   └── App.jsx           # Main application component with routing
│   └── main.jsx          # Entry point of the application
├── .env.example          # Example environment variables
├── package.json
└── README.md
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please open an issue first to discuss any major changes you would like to make.

## License

This project is distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

*   **MetaGPT:** For demonstrating the future of AI-powered software development.
*   **Supabase:** For providing a powerful and easy-to-use backend solution.
*   **You:** For taking the time to explore PayTrack!

---
