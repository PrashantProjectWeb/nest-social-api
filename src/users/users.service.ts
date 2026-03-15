import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getUsers(page = 1, limit = 10, name?: string) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepo.findAndCount({
      where: name ? { name: Like(`%${name}%`) } : {},
      select: {
        id: true,
        name: true,
        email: true,
      },
      skip,
      take: limit,
    });

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  async getUser(id: string) {
    return this.usersRepo.findOne({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async registerUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existingUser = await this.usersRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<User>);

    const saved = await this.usersRepo.save(user);
    // remove password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = saved as any;
    return safe as Partial<User>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async update(id:number, updateUserDto: UpdateUserDto){

  }
}
