import * as bcryptjs from 'bcryptjs'
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interface/jwt-payload.interface';
import { LoginResponse } from './interface/login-response';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,
    private jwtService: JwtService
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

  async login( loginDto: LoginDto ): Promise<LoginResponse> {
    const { email, pass } = loginDto;
    const user = await this.userModel.findOne({email});
    if( !bcryptjs.compareSync(pass, user?.pass) || !user ){
      throw new UnauthorizedException('Invalid Credentials!!');
    }
    const { pass:_ , ...rest } = user.toJSON();
    return {
      user: rest,
      access_token: this.getJwtToken( { id: user.id } )
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

  getJwtToken( payload: Payload ){
    return this.jwtService.sign(payload);
  }
}
