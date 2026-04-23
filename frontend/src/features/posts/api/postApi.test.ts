import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPost, CreatePostData } from './postApi';
import { instance } from '@/lib/axiosConfig';

describe('postApi createPost', () => {
  const postData: CreatePostData = {
    post_text: 'Publicación de prueba',
    tattoo_styles_id: 1,
    image_urls: ['https://example.com/test-image.jpg'],
  };

  const mockPost = {
    post_id: 1,
    user_id: 1,
    post_text: postData.post_text,
    num_likes: 0,
    num_comments: 0,
    num_repost: 0,
    tattoo_styles_id: postData.tattoo_styles_id,
    created_at: '2026-04-15T12:00:00Z',
    user_handle: 'admin_user',
    first_name: 'Admin',
    last_name: 'Tatu',
    image: 'https://example.com/profile.jpg',
    tattoo_style_name: 'Realismo',
    images: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa la instancia axios autenticada con withCredentials para subir publicaciones', () => {
    expect(instance.defaults.withCredentials).toBe(true);
  });

  it('llama a /api/posts y retorna el post creado', async () => {
    const postSpy = vi.spyOn(instance, 'post').mockResolvedValue({ data: mockPost } as any);

    const result = await createPost(postData);

    expect(postSpy).toHaveBeenCalledWith('/api/posts', postData);
    expect(result).toEqual(mockPost);
  });

  it('propaga el error cuando la creación falla', async () => {
    const error = new Error('Error de servidor');
    vi.spyOn(instance, 'post').mockRejectedValue(error);

    await expect(createPost(postData)).rejects.toThrow('Error de servidor');
  });
});
