# PRD Site

A modern web application for generating and managing Product Requirement Documents (PRDs) using AI assistance. Built with Next.js and enhanced with AI capabilities.

## Features

- **AI-Powered PRD Generation**: Create comprehensive PRDs with AI assistance
- **User Authentication**: Secure user authentication powered by Clerk
- **Database Storage**: PostgreSQL database with Prisma ORM for reliable data persistence
- **Modern UI**: Built with React and styled using modern UI components
- **Real-time Updates**: Instant updates and responsive interface
- **Markdown Support**: View and edit PRDs in markdown format

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Anthropic AI SDK
- **UI Components**: Radix UI
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with class-variance-authority

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   CLERK_SECRET_KEY="your_clerk_secret"
   CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/prisma` - Database schema and configurations
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configurations

## Contributing

Feel free to submit issues and enhancement requests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
