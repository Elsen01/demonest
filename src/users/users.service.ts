import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const userDb = await this.findByEmail(createUserDto.email);
    if (userDb) {
      throw new HttpException(
        `${createUserDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = new UserEntity();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstname;
    user.lastName = createUserDto.lastname;
    return this.usersRepository.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }
}
