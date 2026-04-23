import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { login } from '@/features/auth/actions/login';

const authState = {
  isAuthenticated: false,
  user: null as null | { username: string; id: number; rol: number },
  photo: null as string | null,
  profileData: vi.fn(),
  login(user_handle: string, user_id: number, role_id: number) {
    this.user = { username: user_handle, id: user_id, rol: role_id };
    this.isAuthenticated = true;
  },
  logout() {
    this.user = null;
    this.isAuthenticated = false;
  },
};

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => authState,
}));

vi.mock('@/features/auth/api/authApi', () => ({
  loginUser: vi.fn(),
}));

vi.mock('@/features/posts/api/postApi', () => ({
  getAllPosts: vi.fn(),
  getTattooStyles: vi.fn(),
  createPost: vi.fn(),
}));

vi.mock('@/features/profile/api/uploadPhotoProfile', () => ({
  uploadPhotoProfile: vi.fn(),
}));

vi.mock('@/features/explore', () => ({
  PeopleExplore: () => <div>PeopleExploreMock</div>,
}));

vi.mock('@/features/navigation', () => ({
  Nav: () => <div>NavMock</div>,
}));

import Explore from '@/pages/Explore/Explore';
import * as authApi from '@/features/auth/api/authApi';
import * as postApi from '@/features/posts/api/postApi';
import * as uploadProfile from '@/features/profile/api/uploadPhotoProfile';

const mockedLoginUser = vi.mocked(authApi.loginUser);
const mockedGetAllPosts = vi.mocked(postApi.getAllPosts);
const mockedGetTattooStyles = vi.mocked(postApi.getTattooStyles);
const mockedCreatePost = vi.mocked(postApi.createPost);
const mockedUploadPhotoProfile = vi.mocked(uploadProfile.uploadPhotoProfile);

describe('E2E: autenticación y subida de archivos', () => {
  const originalFileReader = global.FileReader;

  beforeAll(() => {
    class MockFileReader {
      public result: string | null = 'data:image/png;base64,dummy';
      public onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
      readAsDataURL() {
        if (this.onloadend) {
          this.onloadend({} as ProgressEvent<FileReader>);
        }
      }
    }

    // @ts-expect-error replace global in test environment
    global.FileReader = MockFileReader;
  });

  afterAll(() => {
    // @ts-expect-error restore global
    global.FileReader = originalFileReader;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    authState.logout();
    vi.stubEnv('VITE_PRIVATE_KEY_IMAGEKIT', 'testkey123');
  });

  it('realiza login y sube un post con imagen correctamente', async () => {
    mockedLoginUser.mockResolvedValue({
      validation: true,
      message: 'OK',
      user: 'admin',
      id: 1,
      role: 1,
    });

    const formData = new FormData();
    formData.append('user_handle', 'admin');
    formData.append('password_hash', 'password123');

    const loginState = await login(undefined as any, formData);

    expect(loginState.message).toBe('OK');
    expect(loginState.userData?.user_handle).toBe('admin');

    authState.login(
      loginState.userData!.user_handle,
      loginState.userId!,
      loginState.userData!.role_id,
    );

    const initialPostList: any[] = [];
    const createdPost = {
      post_id: 100,
      user_id: 1,
      post_text: 'Publicación de prueba',
      num_likes: 0,
      num_comments: 0,
      num_repost: 0,
      tattoo_styles_id: 1,
      created_at: new Date().toISOString(),
      user_handle: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      image: 'https://example.com/uploaded.png',
      tattoo_style_name: 'Realismo',
      images: [],
    };

    mockedGetAllPosts
      .mockResolvedValueOnce(initialPostList)
      .mockResolvedValueOnce([createdPost]);
    mockedGetTattooStyles.mockResolvedValue([
      { tattoo_styles_id: 1, tattoo_styles_name: 'Realismo' },
    ]);
    mockedUploadPhotoProfile.mockResolvedValue({ data: { url: 'https://example.com/uploaded.png' } });
    mockedCreatePost.mockResolvedValue(createdPost);

    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('+ Crear publicación')).toBeInTheDocument();
    });

    await user.click(screen.getByText('+ Crear publicación'));

    const postTextInput = await screen.findByPlaceholderText('¿Qué estás pensando?');
    await user.type(postTextInput, 'Publicación de prueba');

    const fileInput = screen.getByLabelText(/Imágenes/i) as HTMLInputElement;
    const file = new File(['image content'], 'tattoo.png', { type: 'image/png' });
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(fileInput.files).toHaveLength(1);
      expect(screen.getByRole('button', { name: /Publicar/i })).toBeEnabled();
    });

    const submitButton = screen.getByRole('button', { name: /Publicar/i });
    const formElement = submitButton.closest('form');
    expect(formElement).toBeTruthy();
    fireEvent.submit(formElement!);

    await waitFor(() => {
      expect(mockedUploadPhotoProfile).toHaveBeenCalled();
      expect(mockedCreatePost).toHaveBeenCalledWith({
        post_text: 'Publicación de prueba',
        tattoo_styles_id: 1,
        image_urls: ['https://example.com/uploaded.png'],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Publicación de prueba')).toBeInTheDocument();
    });
  });
});
