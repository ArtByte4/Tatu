interface MockUser {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  role_id: number;
  birth_day: string;
  email_address: string;
  phonenumber: string;
  password_hash: string;
  created_at: Date;
}

interface MockProfile {
  user_id: number;
  gender: string;
  image: string;
  bio: string;
  follower_count: number;
}

interface MockPost {
  post_id: number;
  user_id: number;
  post_text: string;
  num_likes: number;
  num_comments: number;
  num_repost: number;
  tattoo_styles_id: number;
  created_at: Date;
}

interface MockImage {
  image_id: number;
  src: string;
  content: string;
  created_at: Date;
  user_id: number;
}

interface SeedUserInput {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
  role_id?: number;
  image?: string;
  bio?: string;
  gender?: string;
  follower_count?: number;
}

const DEFAULT_PROFILE_IMAGE = "https://cdn.tatu.app/default-profile.png";

export class MockDatabase {
  private users: MockUser[] = [];
  private profiles: MockProfile[] = [];
  private posts: MockPost[] = [];
  private images: MockImage[] = [];
  private postImages: Array<{ post_id: number; image_id: number }> = [];

  private userSeq = 1;
  private postSeq = 1;
  private imageSeq = 1;

  private tattooStyles = [
    { tattoo_styles_id: 1, tattoo_styles_name: "Blackwork" },
    { tattoo_styles_id: 2, tattoo_styles_name: "Traditional" },
    { tattoo_styles_id: 3, tattoo_styles_name: "Minimalist" },
  ];

  public async seedUser(input: SeedUserInput): Promise<MockUser> {
    const user: MockUser = {
      user_id: this.userSeq++,
      user_handle: input.user_handle,
      first_name: input.first_name,
      last_name: input.last_name,
      role_id: input.role_id ?? 1,
      birth_day: input.birth_day,
      email_address: input.email_address,
      phonenumber: input.phonenumber,
      password_hash: input.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);
    this.profiles.push({
      user_id: user.user_id,
      gender: input.gender ?? "Prefer not to say",
      image: input.image ?? DEFAULT_PROFILE_IMAGE,
      bio: input.bio ?? "",
      follower_count: input.follower_count ?? 0,
    });

    return user;
  }

  public query = async (sql: string, params?: unknown): Promise<[unknown, unknown]> => {
    const normalized = sql.replace(/\s+/g, " ").trim().toLowerCase();
    const values = Array.isArray(params) ? params : [];

    if (normalized.startsWith("select * from users where user_handle = ?")) {
      const userHandle = String(values[0] ?? "");
      const user = this.users.find((item) => item.user_handle === userHandle);
      return [user ? [user] : [], undefined];
    }

    if (normalized.startsWith("select * from users where email_address = ?")) {
      const email = String(values[0] ?? "");
      const user = this.users.find((item) => item.email_address === email);
      return [user ? [user] : [], undefined];
    }

    if (normalized.startsWith("select * from users where phonenumber = ?")) {
      const phone = String(values[0] ?? "");
      const user = this.users.find((item) => item.phonenumber === phone);
      return [user ? [user] : [], undefined];
    }

    if (normalized.startsWith("insert into users (")) {
      const user: MockUser = {
        user_id: this.userSeq++,
        user_handle: String(values[0]),
        email_address: String(values[1]),
        first_name: String(values[2]),
        last_name: String(values[3]),
        phonenumber: String(values[4]),
        role_id: Number(values[5]),
        password_hash: String(values[6]),
        birth_day: String(values[7]),
        created_at: new Date(),
      };

      this.users.push(user);
      this.profiles.push({
        user_id: user.user_id,
        gender: "Prefer not to say",
        image: DEFAULT_PROFILE_IMAGE,
        bio: "",
        follower_count: 0,
      });

      return [{ insertId: user.user_id, affectedRows: 1 }, undefined];
    }

    if (
      normalized.includes("from users u join profile p on p.user_id = u.user_id") &&
      normalized.includes("where u.user_handle like ?")
    ) {
      const rawTerm = String(values[0] ?? "").toLowerCase();
      const term = rawTerm.replaceAll("%", "");

      const users = this.users
        .filter((user) => {
          const profile = this.profiles.find((item) => item.user_id === user.user_id);
          return (
            user.user_handle.toLowerCase().includes(term) ||
            user.first_name.toLowerCase().includes(term) ||
            user.last_name.toLowerCase().includes(term) ||
            (profile?.bio ?? "").toLowerCase().includes(term)
          );
        })
        .sort((a, b) => a.user_handle.localeCompare(b.user_handle))
        .map((user) => {
          const profile = this.profiles.find((item) => item.user_id === user.user_id);
          return {
            user_id: user.user_id,
            user_handle: user.user_handle,
            first_name: user.first_name,
            last_name: user.last_name,
            role_id: user.role_id,
            birth_day: user.birth_day,
            gender: profile?.gender ?? "Prefer not to say",
            image: profile?.image ?? DEFAULT_PROFILE_IMAGE,
            bio: profile?.bio ?? "",
            follower_count: profile?.follower_count ?? 0,
          };
        });

      return [users, undefined];
    }

    if (
      normalized.includes("from users u join profile p on p.user_id = u.user_id") &&
      normalized.includes("where user_handle = ?")
    ) {
      const userHandle = String(values[0] ?? "");
      const user = this.users.find((item) => item.user_handle === userHandle);

      if (!user) {
        return [[], undefined];
      }

      const profile = this.profiles.find((item) => item.user_id === user.user_id);

      return [
        [
          {
            user_id: user.user_id,
            user_handle: user.user_handle,
            image: profile?.image ?? DEFAULT_PROFILE_IMAGE,
            bio: profile?.bio ?? "",
            first_name: user.first_name,
          },
        ],
        undefined,
      ];
    }

    if (normalized.startsWith("insert into posts (user_id, post_text, tattoo_styles_id)")) {
      const post: MockPost = {
        post_id: this.postSeq++,
        user_id: Number(values[0]),
        post_text: String(values[1]),
        tattoo_styles_id: Number(values[2]),
        num_likes: 0,
        num_comments: 0,
        num_repost: 0,
        created_at: new Date(),
      };

      this.posts.push(post);
      return [{ insertId: post.post_id, affectedRows: 1 }, undefined];
    }

    if (normalized.startsWith("insert into image (src, content, user_id)")) {
      const image: MockImage = {
        image_id: this.imageSeq++,
        src: String(values[0]),
        content: String(values[1]),
        user_id: Number(values[2]),
        created_at: new Date(),
      };

      this.images.push(image);
      return [{ insertId: image.image_id, affectedRows: 1 }, undefined];
    }

    if (normalized.startsWith("insert into post_image (post_id, image_id)")) {
      this.postImages.push({
        post_id: Number(values[0]),
        image_id: Number(values[1]),
      });

      return [{ affectedRows: 1 }, undefined];
    }

    if (normalized.includes("from posts p") && normalized.includes("where p.post_id = ?")) {
      const postId = Number(values[0]);
      const post = this.posts.find((item) => item.post_id === postId);
      return [post ? [this.buildPostRow(post)] : [], undefined];
    }

    if (normalized.includes("from image i") && normalized.includes("where pi.post_id = ?")) {
      const postId = Number(values[0]);
      const relatedImages = this.postImages
        .filter((relation) => relation.post_id === postId)
        .map((relation) => this.images.find((image) => image.image_id === relation.image_id))
        .filter((item): item is MockImage => Boolean(item))
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map((image) => ({
          image_id: image.image_id,
          src: image.src,
          content: image.content,
          created_at: image.created_at,
          user_id: image.user_id,
        }));

      return [relatedImages, undefined];
    }

    if (normalized.includes("from posts p") && normalized.includes("order by p.created_at desc")) {
      const styleId = normalized.includes("where p.tattoo_styles_id = ?")
        ? Number(values[0])
        : undefined;

      const posts = this.posts
        .filter((post) => (styleId ? post.tattoo_styles_id === styleId : true))
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .map((post) => this.buildPostRow(post));

      return [posts, undefined];
    }

    throw new Error(`MockDatabase query no manejada: ${normalized}`);
  };

  private buildPostRow(post: MockPost) {
    const user = this.users.find((item) => item.user_id === post.user_id);
    const profile = this.profiles.find((item) => item.user_id === post.user_id);
    const style = this.tattooStyles.find((item) => item.tattoo_styles_id === post.tattoo_styles_id);

    return {
      post_id: post.post_id,
      user_id: post.user_id,
      post_text: post.post_text,
      num_likes: post.num_likes,
      num_comments: post.num_comments,
      num_repost: post.num_repost,
      tattoo_styles_id: post.tattoo_styles_id,
      created_at: post.created_at,
      user_handle: user?.user_handle ?? "",
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      image: profile?.image ?? DEFAULT_PROFILE_IMAGE,
      tattoo_style_name: style?.tattoo_styles_name ?? "Unknown",
    };
  }
}
