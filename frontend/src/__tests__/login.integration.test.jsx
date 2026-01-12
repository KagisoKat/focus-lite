import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock axios to avoid real API calls
import axios from 'axios';
vi.mock('axios');

describe('Login Integration Test', () => {
    it('should login and navigate to tasks page', async () => {
        const user = userEvent.setup();

        // Mock successful login
        axios.post.mockResolvedValueOnce({
            data: { ok: true, token: 'fake-jwt-token' }
        });

        // Mock tasks list
        axios.get.mockResolvedValueOnce({
            data: { ok: true, tasks: [] }
        });

        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        // Should start on login page
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();

        // Fill in login form
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'Password123!');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        // Should navigate to tasks page
        await waitFor(() => {
            expect(screen.getByText(/my tasks/i)).toBeInTheDocument();
        });
    });
});
