import * as bcryptjs from 'bcryptjs'
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { pass , ...userData } = createUserDto;
      const newUser = new this.userModel({
        pass: bcryptjs.hashSync( pass, 10),
        ...userData
      });
      await newUser.save();

      const { pass:_ , ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if( error.code === 11000){
        throw new BadRequestException(`${ createUserDto.email } already exist!! `)
      }
      throw new InternalServerErrorException('Somethings terrible happens!') 
    }
  }

  async login( loginDto: LoginDto ) {
    const { email, pass } = loginDto;
    const user = await this.userModel.findOne({email});
    if( !bcryptjs.compareSync(pass, user?.pass) || !user ){
      throw new UnauthorizedException('Invalid Credentials!!');
    }
    const { pass:_ , ...userData } = user.toJSON();
    return {
      user: userData,
      token: 'ACADeBEHABERUNTOKEN'
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
