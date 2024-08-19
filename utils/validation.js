import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const validateLoginUser = async (username, password, t_user, connections) => {
  const user = await t_user.findOne({ where: { username } });

  if (!user) {
    throw new Error(`Kullanıcı Bulunamadı`);
  }
  const passwordControl = await compare(password, user.password);

  if (!passwordControl) {
    throw new Error(`Parola Yanlış`);
  }

  // Kullanıcı oturumu açık mı kontrol et
  for (const [user, connection] of connections()) {
    if (username === user) {
      throw new Error("Kullanıcı oturumu açık");
    }
  }
};

const validateRegisterUser = async (
  username,
  password,
  t_user,
  connections
) => {
  const MIN_USERNAME_LENGTH = 6;
  const MIN_PASSWORD_LENGTH = 6;

  // Kullanıcı adı ve şifre için minimum karakter kontrolü
  if (username.length < MIN_USERNAME_LENGTH) {
    throw new Error(
      `Kullanıcı adı en az ${MIN_USERNAME_LENGTH} karakter olmalıdır.`
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır.`);
  }

  const user = await t_user.findOne({ where: { username } });

  if (user) {
    throw new Error(`Kullanıcı Mevcut`);
  }
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error(`Yetkisiz erişim: Token eksik"`);
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
export { validateLoginUser, validateRegisterUser, verifyToken };
