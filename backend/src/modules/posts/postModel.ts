import connection from "../../db";

export interface Post {
  post_id: number;
  user_id: number;
  post_text: string;
  num_likes: number;
  num_comments: number;
  num_repost: number;
  tattoo_styles_id: number;
  created_at: Date;
  user_handle?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
  tattoo_style_name?: string;
}

export interface PostImage {
  image_id: number;
  src: string;
  content: string;
  created_at: Date;
  user_id: number;
}

export interface TattooStyle {
  tattoo_styles_id: number;
  tattoo_styles_name: string;
}

export interface CreatePostInput {
  user_id: number;
  post_text: string;
  tattoo_styles_id: number;
  image_urls?: string[];
}

// Crear un nuevo post
export const createPost = async (
  postData: CreatePostInput
): Promise<number> => {
  const { user_id, post_text, tattoo_styles_id, image_urls } = postData;

  const query = `
    INSERT INTO posts (user_id, post_text, tattoo_styles_id)
    VALUES (?, ?, ?)
  `;

  try {
    const [result] = await connection.query(query, [
      user_id,
      post_text,
      tattoo_styles_id,
    ]);
    const insertResult = result as any;
    const postId = insertResult.insertId;

    // Si hay imágenes, crearlas y relacionarlas
    if (image_urls && image_urls.length > 0) {
      for (const imageUrl of image_urls) {
        // Crear entrada en tabla image
        const imageQuery = `
          INSERT INTO image (src, content, user_id)
          VALUES (?, ?, ?)
        `;
        const [imageResult] = await connection.query(imageQuery, [
          imageUrl,
          post_text.substring(0, 500), // Primeros 500 caracteres del post como content
          user_id,
        ]);
        const imageInsertResult = imageResult as any;
        const imageId = imageInsertResult.insertId;

        // Relacionar imagen con post
        const postImageQuery = `
          INSERT INTO post_image (post_id, image_id)
          VALUES (?, ?)
        `;
        await connection.query(postImageQuery, [postId, imageId]);
      }
    }

    return postId;
  } catch (err) {
    console.error("Error al crear post:", err);
    throw err;
  }
};

// Obtener todos los posts con información del usuario y estilo
export const getAllPosts = async (): Promise<Post[]> => {
  const query = `
    SELECT 
      p.post_id,
      p.user_id,
      p.post_text,
      p.num_likes,
      p.num_comments,
      p.num_repost,
      p.tattoo_styles_id,
      p.created_at,
      u.user_handle,
      u.first_name,
      u.last_name,
      pr.image,
      ts.tattoo_styles_name as tattoo_style_name
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    LEFT JOIN profile pr ON p.user_id = pr.user_id
    JOIN tattoo_styles ts ON p.tattoo_styles_id = ts.tattoo_styles_id
    ORDER BY p.created_at DESC
  `;

  try {
    const [rows] = await connection.query(query);
    return rows as Post[];
  } catch (err) {
    console.error("Error al obtener posts:", err);
    throw err;
  }
};

// Obtener posts de un usuario específico
export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  const query = `
    SELECT 
      p.post_id,
      p.user_id,
      p.post_text,
      p.num_likes,
      p.num_comments,
      p.num_repost,
      p.tattoo_styles_id,
      p.created_at,
      u.user_handle,
      u.first_name,
      u.last_name,
      pr.image,
      ts.tattoo_styles_name as tattoo_style_name
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    LEFT JOIN profile pr ON p.user_id = pr.user_id
    JOIN tattoo_styles ts ON p.tattoo_styles_id = ts.tattoo_styles_id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `;

  try {
    const [rows] = await connection.query(query, [userId]);
    return rows as Post[];
  } catch (err) {
    console.error("Error al obtener posts del usuario:", err);
    throw err;
  }
};

// Obtener imágenes de un post
export const getPostImages = async (postId: number): Promise<PostImage[]> => {
  const query = `
    SELECT 
      i.image_id,
      i.src,
      i.content,
      i.created_at,
      i.user_id
    FROM image i
    JOIN post_image pi ON i.image_id = pi.image_id
    WHERE pi.post_id = ?
    ORDER BY i.created_at ASC
  `;

  try {
    const [rows] = await connection.query(query, [postId]);
    return rows as PostImage[];
  } catch (err) {
    console.error("Error al obtener imágenes del post:", err);
    throw err;
  }
};

// Obtener lista de estilos de tatuaje
export const getTattooStyles = async (): Promise<TattooStyle[]> => {
  const query = `
    SELECT 
      tattoo_styles_id,
      tattoo_styles_name
    FROM tattoo_styles
    ORDER BY tattoo_styles_name ASC
  `;

  try {
    const [rows] = await connection.query(query);
    return rows as TattooStyle[];
  } catch (err) {
    console.error("Error al obtener estilos de tatuaje:", err);
    throw err;
  }
};

// Obtener un post por ID con imágenes
export const getPostById = async (postId: number): Promise<Post | undefined> => {
  const query = `
    SELECT 
      p.post_id,
      p.user_id,
      p.post_text,
      p.num_likes,
      p.num_comments,
      p.num_repost,
      p.tattoo_styles_id,
      p.created_at,
      u.user_handle,
      u.first_name,
      u.last_name,
      pr.image,
      ts.tattoo_styles_name as tattoo_style_name
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    LEFT JOIN profile pr ON p.user_id = pr.user_id
    JOIN tattoo_styles ts ON p.tattoo_styles_id = ts.tattoo_styles_id
    WHERE p.post_id = ?
  `;

  try {
    const [rows] = await connection.query(query, [postId]);
    const posts = rows as Post[];
    return posts[0];
  } catch (err) {
    console.error("Error al obtener post:", err);
    throw err;
  }
};



