# Personal Portfolio Website

This is a personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS. It showcases my projects, skills, and experience.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite:** A fast build tool and development server for modern web projects.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **shadcn-ui:** A collection of reusable components built using Radix UI and Tailwind CSS.
- **Supabase:** An open source Firebase alternative for building secure and scalable backend services.
- **React Router:** For declarative routing in React applications.
- **React Hook Form:** For flexible and extensible forms in React.
- **Recharts:** A composable charting library built on React components.
- **Lucide React:** A library of simply beautiful icons.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, usually on `http://localhost:8080`. The application will automatically reload if you change any of the source files.

## Building the Project

To create a production build of the project, run:

```bash
npm run build
```
This command will generate a `dist` folder in the project root with the optimized static assets for your application.

## Testing

This project uses ESLint for linting. To run the linter, use:

```bash
npm run lint
```
Currently, there are no automated end-to-end or unit tests configured for this project.

## Deployment to Cloudflare Pages

This project can be easily deployed to Cloudflare Pages.

### Prerequisites

- A Cloudflare account.
- Your project pushed to a GitHub repository.

### Steps:

1.  **Log in to Cloudflare:** Go to your Cloudflare dashboard.
2.  **Connect to Git:**
    *   In the sidebar, navigate to **Workers & Pages**.
    *   Click on **Create application**, then select the **Pages** tab.
    *   Click **Connect to Git**.
3.  **Select Repository:**
    *   Choose the GitHub repository where your project is hosted.
    *   Click **Begin setup**.
4.  **Configure Build Settings:**
    *   **Project name:** Choose a name for your Pages project.
    *   **Production branch:** Select the branch you want to deploy (e.g., `main` or `master`).
    *   **Framework preset:** Select **Vite** from the dropdown. Cloudflare Pages will automatically detect most settings.
    *   **Build command:** This should be automatically set to `npm run build` (or `vite build`).
    *   **Build output directory:** This should be automatically set to `dist`.
    *   **(Optional) Environment Variables:** If your project requires environment variables (e.g., for Supabase integration), add them under **Environment variables (advanced)**.
        *   `VITE_SUPABASE_URL`: Your Supabase project URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous public key.
5.  **Deploy:**
    *   Click **Save and Deploy**.
    *   Cloudflare Pages will now build and deploy your site. You can monitor the deployment progress.
    *   Once deployed, you'll get a unique `*.pages.dev` subdomain for your project. You can also add custom domains later.

### Subsequent Deployments

Cloudflare Pages will automatically redeploy your site whenever you push new changes to the connected production branch in your GitHub repository.
