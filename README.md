# Makan Where 🍽️

A fun and interactive restaurant decision-making app that helps you and your company decide where to eat! Features a spinning wheel for random restaurant selection and supports multiple storage methods.

## Features

- 🎯 **Interactive Spinning Wheel** - Randomly select restaurants with a fun spinning animation
- ☁️ **Cloud Storage** - Authorized users can sync data across devices using Supabase
- 💾 **Local Storage** - Non-authorized users can store data locally in their browser
- 🔧 **Custom Supabase** - Users can configure their own Supabase database
- 📱 **Responsive Design** - Works great on desktop and mobile devices
- 🎨 **Beautiful UI** - Modern design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd makan_what
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Configure your `.env.local` file:

```env
# Supabase Configuration (for authorized users)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Authorized Users (comma-separated)
# These users will have access to the main Supabase cloud storage
AUTHORIZED_USERS=companyname1,username1
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Storage Methods

### 1. Authorized Users (Cloud Storage)

Users listed in `AUTHORIZED_USERS` will automatically use the main Supabase database for cloud storage.

### 2. Custom Supabase Configuration

Unauthorized users can configure their own Supabase database:

1. **Create a Supabase Project**:

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings > API

2. **Set up the Database**:

   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase-setup.sql`

3. **Configure in the App**:
   - Enter your organization name on the landing page
   - Click "Configure Your Own Supabase" button
   - Enter your Supabase URL and anon key
   - The app will test the connection and save your configuration

### 3. Local Storage (Fallback)

If no cloud storage is configured, the app will use browser localStorage.

## Database Schema

The app requires a table named `"makan where"` with the following structure:

```sql
CREATE TABLE "makan where" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range TEXT NOT NULL,
    is_halal BOOLEAN NOT NULL DEFAULT false,
    google_url TEXT,
    org_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage

1. **Enter Organization Name**: Type your company or username on the landing page
2. **Add Restaurants**: Click the "+ Add Restaurant" button to add new restaurants
3. **Spin the Wheel**: Click the spinning wheel to randomly select a restaurant
4. **Manage Data**: Edit or delete restaurants as needed
5. **Storage Settings**: Use the settings menu to configure custom Supabase or manage storage

## Security Features

- ✅ Environment variables for authorized users (not exposed to client)
- ✅ Custom Supabase configurations stored locally only
- ✅ No tracking or storage of user credentials
- ✅ Proper error handling and fallbacks
- ✅ Input validation and sanitization

## Troubleshooting

### Custom Supabase Issues

If you encounter errors with your custom Supabase configuration:

1. **Check your credentials**: Ensure your URL and anon key are correct
2. **Verify table exists**: Make sure you've run the `supabase-setup.sql` script
3. **Check permissions**: Ensure your anon key has the necessary permissions
4. **Fallback behavior**: The app will automatically fall back to localStorage if Supabase fails

### Common Error Messages

- **"Table 'makan where' not found"**: Run the SQL setup script in your Supabase SQL Editor
- **"Invalid API key"**: Check your anon key in Supabase Settings > API
- **"Unable to connect"**: Verify your Supabase URL is correct

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utility functions and services
└── styles/             # Theme and styling
```

### Key Files

- `src/lib/secureRestaurantService.ts` - Main service for restaurant operations
- `src/lib/customSupabaseService.ts` - Custom Supabase configuration management
- `src/components/SupabaseConfigModal.tsx` - Modal for Supabase configuration
- `supabase-setup.sql` - Database setup script

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
