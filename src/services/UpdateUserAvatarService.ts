import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import User from '../models/User';

interface RequestDTO {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Usuário não econtrado.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = fs.existsSync(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;