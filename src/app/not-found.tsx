import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Browse Coins</span>
            </Link>
          </div>

          <div className="mt-16 p-6 bg-card border border-border rounded-xl text-left">
            <h3 className="text-lg font-semibold mb-4">What you can do:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                <span>Go back to the homepage</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                <span>Use the search function to find specific coins</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                <span>Browse our list of top cryptocurrencies</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}