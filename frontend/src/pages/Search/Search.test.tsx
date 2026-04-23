import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Search } from './Search';
import * as searchApi from '../../features/search/api/searchApi';
import * as profileApi from '../../features/profile/api';

// Mock de los módulos
vi.mock('../../features/search/api/searchApi');
vi.mock('../../features/profile/api');
vi.mock('../../features/navigation', () => ({
  Nav: () => <div>Navigation Component</div>
}));

// Mock de authStore
vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { username: 'testuser' }
  })
}));

describe('Componente Search', () => {
  const renderSearch = () => {
    return render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el campo de búsqueda', () => {
    renderSearch();
    
    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
    expect(searchInput).toBeInTheDocument();
  });

  it('debe mostrar resultados cuando se busca un usuario existente', async () => {
    const mockSearchResults = [
      {
        username: 'prueba',
        first_name: 'Prueba',
        last_name: 'Usuario',
        email_address: 'prueba@gmail.com',
        image: 'https://example.com/image.jpg'
      }
    ];

    vi.mocked(searchApi.searchUsers).mockResolvedValue(mockSearchResults);
    vi.mocked(profileApi.getProfile).mockResolvedValue({
      message: 'No encontrado'
    });

    const user = userEvent.setup();
    renderSearch();

    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
    await user.type(searchInput, 'prueba');

    await waitFor(() => {
      expect(screen.getByText('Prueba Usuario')).toBeInTheDocument();
    });
  });

  it('debe mostrar la sección de resultados cuando hay búsqueda', async () => {
    const mockSearchResults = [
      {
        username: 'prueba',
        first_name: 'Prueba',
        last_name: 'Usuario',
        email_address: 'prueba@gmail.com',
        image: 'https://example.com/image.jpg'
      }
    ];

    vi.mocked(searchApi.searchUsers).mockResolvedValue(mockSearchResults);
    vi.mocked(profileApi.getProfile).mockResolvedValue({
      message: 'No encontrado'
    });

    const user = userEvent.setup();
    renderSearch();

    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
    await user.type(searchInput, 'prueba');

    await waitFor(() => {
      expect(screen.getByText('Resultados de búsqueda:')).toBeInTheDocument();
    });
  });

  it('debe mostrar perfil destacado cuando se encuentra un perfil exacto', async () => {
    const mockProfile = {
      user_id: 1,
      user_handle: 'mike',
      image: 'https://ik.imagekit.io/image.jpg',
      bio: 'Bio',
      first_name: 'Michael'
    };

    vi.mocked(profileApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(searchApi.searchUsers).mockResolvedValue([]);

    const user = userEvent.setup();
    renderSearch();

    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
    await user.type(searchInput, 'mike');

    await waitFor(() => {
      expect(screen.getByText('Perfil con mayor coincidencia @:')).toBeInTheDocument();
      expect(screen.getByText('Michael')).toBeInTheDocument();
    });
  });

  it('debe mostrar botón "Ver perfil" para cada resultado', async () => {
    const mockSearchResults = [
      {
        username: 'usuario1',
        first_name: 'Usuario',
        last_name: 'Uno',
        email_address: 'usuario1@gmail.com',
        image: 'https://example.com/image1.jpg'
      }
    ];

    vi.mocked(searchApi.searchUsers).mockResolvedValue(mockSearchResults);
    vi.mocked(profileApi.getProfile).mockResolvedValue({
      message: 'No encontrado'
    });

    const user = userEvent.setup();
    renderSearch();

    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
    await user.type(searchInput, 'usuario');

    await waitFor(() => {
      const buttons = screen.getAllByRole('link', { name: /Ver perfil/i });
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
