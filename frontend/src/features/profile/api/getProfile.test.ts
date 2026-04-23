import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/axiosConfig', () => ({
  instance: {
    get: vi.fn(),
  },
}));

import { getProfile } from './getProfile';
import { instance } from '@/lib/axiosConfig';

const mockedGet = vi.mocked(instance.get);

describe('getProfile API', () => {
  const mockUserProfile = {
    user_id: 1,
    user_handle: 'carlos',
    image: 'https://example.com/carlos.jpg',
    bio: 'Artista del tatuaje',
    first_name: 'Carlos',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna el perfil cuando la llamada al API es exitosa', async () => {
    mockedGet.mockResolvedValue({ data: mockUserProfile });

    const result = await getProfile('carlos');

    expect(mockedGet).toHaveBeenCalledWith('/api/users/profile/carlos');
    expect(result).toEqual(mockUserProfile);
  });

  it('devuelve un mensaje de error cuando la llamada falla', async () => {
    const error = new Error('Network error');
    mockedGet.mockRejectedValue(error);

    const result = await getProfile('carlos');

    expect(result).toEqual({
      message: 'Error al obtener perfil de usuario',
      error,
    });
  });
});
