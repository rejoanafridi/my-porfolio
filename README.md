# Professional Portfolio Website

A customizable portfolio website with multiple layout options and an admin panel.

## Setup Instructions

### Prerequisites

-   Node.js 18+ and npm
-   PostgreSQL database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/rejanafridi/my-porfolio.git
   cd portfolio-website
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
    - Copy `.env.example` to `.env.local`
    - Update the values with your database credentials and other settings

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Set up the database:

    - Create a PostgreSQL database
    - Run the migration scripts in the `migrations` folder

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Access the website:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)
    - Default login: username: `admin`, password: `password`

## Features

-   Multiple layout options (Default, Creative, Minimal)
-   Fully customizable content through admin panel
-   Responsive design
-   Dark/light mode support
-   SEO optimized

## Tech Stack

-   Next.js 14 (App Router)
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   PostgreSQL
-   Shadcn UI Components
    \`\`\`

