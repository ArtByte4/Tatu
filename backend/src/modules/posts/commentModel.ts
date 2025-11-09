import connection from "../../db";

export interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  user_handle?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
}

// Obtener comentarios de un post con información del usuario
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  const query = `
    SELECT 
      c.comment_id,
      c.post_id,
      c.user_id,
      c.content,
      c.created_at,
      u.user_handle,
      u.first_name,
      u.last_name,
      pr.image
    FROM comments c
    JOIN users u ON c.user_id = u.user_id
    LEFT JOIN profile pr ON c.user_id = pr.user_id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;

  try {
    const [rows] = await connection.query(query, [postId]);
    return rows as Comment[];
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    throw err;
  }
};

// Crear un comentario y actualizar num_comments
export const createComment = async (
  postId: number,
  userId: number,
  content: string
): Promise<number> => {
  const conn = await connection.getConnection();
  
  try {
    await conn.beginTransaction();

    // Insertar el comentario
    const insertQuery = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `;
    const [result] = await conn.query(insertQuery, [postId, userId, content]);
    const insertResult = result as any;
    const commentId = insertResult.insertId;

    // Actualizar num_comments en posts
    const updateQuery = `
      UPDATE posts
      SET num_comments = num_comments + 1
      WHERE post_id = ?
    `;
    await conn.query(updateQuery, [postId]);

    await conn.commit();
    conn.release();
    return commentId;
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error al crear comentario:", err);
    throw err;
  }
};

// Eliminar un comentario y actualizar num_comments
export const deleteComment = async (
  commentId: number,
  userId: number
): Promise<boolean> => {
  const conn = await connection.getConnection();
  
  try {
    await conn.beginTransaction();

    // Verificar que el comentario existe y pertenece al usuario
    const checkQuery = `
      SELECT post_id, user_id FROM comments WHERE comment_id = ?
    `;
    const [checkResult] = await conn.query(checkQuery, [commentId]);
    const comments = checkResult as any[];
    
    if (comments.length === 0) {
      await conn.rollback();
      conn.release();
      throw new Error("Comentario no encontrado");
    }

    if (comments[0].user_id !== userId) {
      await conn.rollback();
      conn.release();
      throw new Error("No tienes permiso para eliminar este comentario");
    }

    const postId = comments[0].post_id;

    // Eliminar el comentario
    const deleteQuery = `
      DELETE FROM comments WHERE comment_id = ?
    `;
    await conn.query(deleteQuery, [commentId]);

    // Actualizar num_comments en posts
    const updateQuery = `
      UPDATE posts
      SET num_comments = GREATEST(num_comments - 1, 0)
      WHERE post_id = ?
    `;
    await conn.query(updateQuery, [postId]);

    await conn.commit();
    conn.release();
    return true;
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error al eliminar comentario:", err);
    throw err;
  }
};

