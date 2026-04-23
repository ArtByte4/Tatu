import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRouteAdmin } from './ProtectedRouterAdmin';
import * as dashboardModule from '../features/auth/hooks/useGetDashboard';

vi.mock('../features/auth/hooks/useGetDashboard', () => ({
  getDashborad: vi.fn(),
}));

describe('ProtectedRouteAdmin', () => {
  const mockedGetDashboard = vi.mocked(dashboardModule.getDashborad);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra la ruta admin cuando el usuario es admin', async () => {
    mockedGetDashboard.mockResolvedValue({ valid: true });

    render(
      <MemoryRouter initialEntries={['/admin']}> 
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/admin" element={<ProtectedRouteAdmin />}>
            <Route index element={<div>Admin content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin content')).toBeInTheDocument();
    });
  });

  it('redirige a la página principal cuando el usuario no es admin', async () => {
    mockedGetDashboard.mockRejectedValue({ mensaje: 'No autorizado' });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/admin" element={<ProtectedRouteAdmin />}>
            <Route index element={<div>Admin content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});
