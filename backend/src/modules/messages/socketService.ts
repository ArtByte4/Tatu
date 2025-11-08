import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../../config";
import { createMessage, getMessageById } from "./messageModel";

interface AuthenticatedSocket extends Socket {
  userId?: number;
  username?: string;
}

interface TypingUsers {
  [roomId: string]: {
    [userId: number]: NodeJS.Timeout;
  };
}

export class SocketService {
  private io: SocketIOServer;
  private typingUsers: TypingUsers = {};

  constructor(httpServer: HTTPServer, originUrl: string) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: originUrl,
        credentials: true,
        methods: ["GET", "POST"],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    // Middleware para autenticación
    this.io.use((socket: AuthenticatedSocket, next) => {
      let token: string | undefined;

      // Intentar obtener token de auth
      if (socket.handshake.auth?.token) {
        token = socket.handshake.auth.token;
      }
      // Intentar obtener token de query params
      else if (socket.handshake.query?.token) {
        token = socket.handshake.query.token as string;
      }
      // Intentar obtener token de cookies
      else if (socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split(";");
        const accessTokenCookie = cookies.find((c: string) =>
          c.trim().startsWith("access_token=")
        );
        if (accessTokenCookie) {
          token = accessTokenCookie.split("=")[1]?.trim();
        }
      }

      if (!token) {
        return next(new Error("Token no proporcionado"));
      }

      jwt.verify(token, SECRET_JWT_KEY, (err: any, decoded: any) => {
        if (err) {
          return next(new Error("Token inválido"));
        }

        const payload = decoded as JwtPayload;
        socket.userId = payload.id;
        socket.username = payload.username;
        next();
      });
    });
  }

  private setupEventHandlers(): void {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      const userId = socket.userId;
      const username = socket.username;

      if (!userId) {
        socket.disconnect();
        return;
      }

      console.log(`Usuario conectado: ${username} (ID: ${userId})`);

      // Unirse a la sala del usuario para recibir mensajes
      socket.join(`user_${userId}`);

      // Evento: Unirse a una conversación (room)
      socket.on("join_conversation", (otherUserId: number) => {
        const roomId = this.getRoomId(userId, otherUserId);
        socket.join(roomId);
        console.log(`Usuario ${userId} se unió a la conversación ${roomId}`);
      });

      // Evento: Enviar mensaje
      socket.on("send_message", async (data: { receiver_id: number; content: string }) => {
        try {
          if (!data.receiver_id || !data.content) {
            socket.emit("error", { message: "Datos incompletos" });
            return;
          }

          // Guardar mensaje en BD
          const result = await createMessage({
            sender_id: userId,
            receiver_id: data.receiver_id,
            content: data.content,
          });

          const messageId = (result as any).insertId;
          const message = await getMessageById(messageId);

          if (!message) {
            socket.emit("error", { message: "Error al crear mensaje" });
            return;
          }

          // Emitir mensaje al receptor
          const receiverRoom = `user_${data.receiver_id}`;
          this.io.to(receiverRoom).emit("new_message", message);

          // Emitir confirmación al emisor
          socket.emit("message_sent", message);

          // También emitir a la sala de conversación si existe
          const roomId = this.getRoomId(userId, data.receiver_id);
          this.io.to(roomId).emit("new_message", message);
        } catch (error) {
          console.error("Error al enviar mensaje:", error);
          socket.emit("error", { message: "Error al enviar mensaje" });
        }
      });

      // Evento: Usuario está escribiendo
      socket.on("typing_start", (data: { receiver_id: number }) => {
        const roomId = this.getRoomId(userId, data.receiver_id);
        
        // Limpiar timeout anterior si existe
        if (this.typingUsers[roomId]?.[userId]) {
          clearTimeout(this.typingUsers[roomId][userId]);
        }

        // Emitir a la otra persona
        socket.to(roomId).emit("user_typing", {
          userId,
          username,
          isTyping: true,
        });

        // Timeout automático después de 3 segundos
        const timeout = setTimeout(() => {
          socket.to(roomId).emit("user_typing", {
            userId,
            username,
            isTyping: false,
          });
          if (this.typingUsers[roomId]) {
            delete this.typingUsers[roomId][userId];
          }
        }, 3000);

        if (!this.typingUsers[roomId]) {
          this.typingUsers[roomId] = {};
        }
        this.typingUsers[roomId][userId] = timeout;
      });

      // Evento: Usuario dejó de escribir
      socket.on("typing_stop", (data: { receiver_id: number }) => {
        const roomId = this.getRoomId(userId, data.receiver_id);
        
        // Limpiar timeout
        if (this.typingUsers[roomId]?.[userId]) {
          clearTimeout(this.typingUsers[roomId][userId]);
          delete this.typingUsers[roomId][userId];
        }

        // Emitir a la otra persona
        socket.to(roomId).emit("user_typing", {
          userId,
          username,
          isTyping: false,
        });
      });

      // Evento: Desconexión
      socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${username} (ID: ${userId})`);
        
        // Limpiar todos los timeouts de typing de este usuario
        Object.keys(this.typingUsers).forEach((roomId) => {
          if (this.typingUsers[roomId][userId]) {
            clearTimeout(this.typingUsers[roomId][userId]);
            delete this.typingUsers[roomId][userId];
          }
        });
      });
    });
  }

  private getRoomId(userId1: number, userId2: number): string {
    // Crear un ID de room consistente independientemente del orden
    const ids = [userId1, userId2].sort((a, b) => a - b);
    return `conversation_${ids[0]}_${ids[1]}`;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

