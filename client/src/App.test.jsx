import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('App', () => {
    const realFetch = global.fetch;

    beforeEach(() => {
        // Mock localStorage for CartContext and AuthContext since it's missing in jsdom
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(() => null),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true
        });
    });

    afterEach(() => {
        // Restore the real fetch after every test so mocks don't leak.
        global.fetch = realFetch;
        vi.clearAllMocks();
    });

    it('shows loader and navigation before fetch resolves', () => {
        // We need to mock fetch because Home triggers a fetch on mount.
        // Returning an unresolved Promise keeps the component in the loading state.
        const mockFetch = vi.fn(() => new Promise(() => {}));
        global.fetch = mockFetch;

        const { container } = render(<App />);

        // The Navbar should be rendered immediately.
        expect(screen.getAllByText(/ShopSmart/i).length).toBeGreaterThan(0);

        // The Home component should show the loader spinner before data resolves.
        expect(container.querySelector('.loader')).toBeInTheDocument();
        expect(container.querySelector('.spinner')).toBeInTheDocument();
    });

    it('renders ShopSmart title and featured products after fetch', async () => {
        // Mock fetch to handle both categories and featured products requests for Home.jsx.
        global.fetch = vi.fn((url) => {
            console.log("Mock fetch called with URL:", url);
            if (url.includes('/api/products/featured')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { _id: '1', name: 'Integration Test Product', price: 100, category: 'Test', inStock: true }
                    ])
                });
            }
            if (url.includes('/api/categories')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { _id: 'cat1', name: 'Electronics', image: 'electronics-img.jpg' }
                    ])
                });
            }
            return Promise.reject(new Error('Unknown URL: ' + url));
        });

        const { container } = render(<App />);

        // Wait for the loader to disappear
        await waitFor(() => {
            expect(container.querySelector('.loader')).not.toBeInTheDocument();
        }, { timeout: 3000 });

        // Now verify the actual content rendered after data load
        expect(screen.getAllByText(/ShopSmart/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Discover Top/i)).toBeInTheDocument();
        expect(screen.getByText(/Trending Now/i)).toBeInTheDocument();
        expect(screen.getByText(/Integration Test Product/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Electronics/i).length).toBeGreaterThan(0);
    });
});
