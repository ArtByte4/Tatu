import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from './useSearch';
import * as searchApi from '../api/searchApi';

// Mock del módulo de searchApi
vi.mock('../api/searchApi', () => ({
  searchUsers: vi.fn()
}));

describe('useSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe inicializar con valores por defecto', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searchResults).toEqual([]);
  });

  it('debe actualizar los resultados cuando se busca con un término válido', async () => {
    const mockResults = [
      {
        username: 'prueba',
        first_name: 'Prueba',
        last_name: 'Usuario',
        email_address: 'prueba@gmail.com',
        image: 'https://example.com/image.jpg'
      }
    ];

    vi.mocked(searchApi.searchUsers).mockResolvedValue(mockResults);

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.searchForUsers('prueba');
    });

    await waitFor(() => {
      expect(result.current.searchResults).toEqual(mockResults);
    });
  });

  it('debe limpiar los resultados cuando el término de búsqueda está vacío', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.searchForUsers('');
    });

    expect(result.current.searchResults).toEqual([]);
  });

  it('debe mostrar error cuando la búsqueda falla', async () => {
    vi.mocked(searchApi.searchUsers).mockRejectedValue(new Error('Error en la búsqueda'));

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.searchForUsers('prueba');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Error al buscar usuarios. Por favor, intenta de nuevo.');
      expect(result.current.searchResults).toEqual([]);
    });
  });

  it('debe manejar error 401 de autenticación', async () => {
    const mockError = {
      response: { status: 401 }
    };
    vi.mocked(searchApi.searchUsers).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.searchForUsers('prueba');
    });

    await waitFor(() => {
      expect(result.current.error).toContain('Sesión expirada');
    });
  });

  it('debe establecer loading en true mientras se busca', async () => {
    vi.mocked(searchApi.searchUsers).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.searchForUsers('prueba');
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
