import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Search } from '../../../pages/Search/Search';
import * as searchApi from '../api/searchApi';
import * as profileApi from '../../profile/api';

vi.mock('../api/searchApi');
vi.mock('../../profile/api');
vi.mock('@/features/navigation', () => ({
  Nav: () => <div>Navigation</div>
}));
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { username: 'testuser', id: 1 }
  })
}));

describe('Search y Profile Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe permitir buscar usuarios y ver perfiles destacados', async () => {
    const mockProfile = {
      user_id: 5,
      user_handle: 'carlos',
      image: 'https://example.com/carlos.jpg',
      bio: 'Desarrollador',
      first_name: 'Carlos',
      last_name: 'Ruiz'
    };

    const mockSearchResults = [
      {
        username: 'carlos',
        first_name: 'Carlos',
        last_name: 'Ruiz',
        email_address: 'carlos@example.com',
        image: 'https://example.com/carlos.jpg'
      },
      {
        username: 'carolina',
        first_name: 'Carolina',
        last_name: 'Lopez',
        email_address: 'carolina@example.com',
        image: 'https://example.com/carolina.jpg'
      }
    ];

    vi.mocked(profileApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(searchApi.searchUsers).mockResolvedValue(mockSearchResults);

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');

    // Escribir en el campo de búsqueda
    await user.type(searchInput, 'carlos');

    // Esperar a que aparezca el perfil destacado
    await waitFor(() => {
      expect(screen.getByText('Perfil con mayor coincidencia @:')).toBeInTheDocument();
    });

    // Verificar que muestra el perfil exacto (en la sección de perfil destacado)
    const profileHighlight = screen.getByText('Perfil con mayor coincidencia @:').closest('.search-container');
    expect(profileHighlight?.querySelector('.profile-name')).toHaveTextContent('Carlos');
    expect(profileHighlight?.querySelector('.profile-handle')).toHaveTextContent('@carlos');

    // Esperar a que aparezcan los resultados de búsqueda
    await waitFor(() => {
      expect(screen.getByText('Resultados de búsqueda:')).toBeInTheDocument();
    });

    // Verificar que muestra múltiples resultados
    const allResults = screen.getAllByText(/Ver perfil/i);
    expect(allResults.length).toBeGreaterThanOrEqual(2);
  });

  it('debe manejar búsqueda sin resultados correctamente', async () => {
    vi.mocked(profileApi.getProfile).mockResolvedValue({ message: 'No encontrado', error: null });
    vi.mocked(searchApi.searchUsers).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');

    await user.type(searchInput, 'usuarioinexistente123');

    // Esperar a que aparezca el mensaje de no resultados
    await waitFor(() => {
      expect(screen.getByText(/No se encontraron usuarios/i)).toBeInTheDocument();
    });
  });

  it('debe permitir navegar a un perfil desde los resultados', async () => {
    const mockProfile = {
      user_id: 6,
      user_handle: 'diana',
      image: 'https://example.com/diana.jpg',
      bio: 'Diseñadora',
      first_name: 'Diana',
      last_name: 'Martinez'
    };

    const mockSearchResults = [
      {
        username: 'diana',
        first_name: 'Diana',
        last_name: 'Martinez',
        email_address: 'diana@example.com',
        image: 'https://example.com/diana.jpg'
      }
    ];

    vi.mocked(profileApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(searchApi.searchUsers).mockResolvedValue(mockSearchResults);

    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');

    await user.type(searchInput, 'diana');

    // Esperar a que aparezcan los botones "Ver perfil"
    await waitFor(() => {
      const profileLinks = screen.getAllByRole('link', { name: /Ver perfil/i });
      expect(profileLinks.length).toBeGreaterThan(0);
    });

    // Verificar que los links apunten al perfil correcto
    const profileLinks = screen.getAllByRole('link', { name: /Ver perfil/i });
    // Buscar el link en los resultados (hay uno en perfil destacado y uno en resultados)
    const resultsLink = profileLinks.find(link => link.closest('.results-grid'));
    expect(resultsLink).toHaveAttribute('href', '/profile/diana');
  });
});
