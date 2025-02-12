import * as bcryptjs from 'bcryptjs'
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { get, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interface/jwt-payload.interface';
import { LoginResponse } from './interface/login-response';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';


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

  async register( registerDto: RegisterUserDto ): Promise<LoginResponse>{
    const user = await this.create(registerDto);
    if (!user._id) {
      throw new Error('User ID is missing');
    }
    const { _id , ...rest } = user;
    return {
      user: rest,
      access_token: this.getJwtToken({ id: user._id })
    }
  }

  async login( loginDto: LoginDto ): Promise<LoginResponse> {
    const { email, pass } = loginDto;
    const user = await this.userModel.findOne({email});
    if( !user ){
      throw new UnauthorizedException('Invalid Credentials - email!!');
    }
    if( !bcryptjs.compareSync(pass, user!.pass) ){
      throw new UnauthorizedException('Invalid Credentials - password!!');
    }
    const { pass:_ , ...rest } = user.toJSON();
    return {
      user: rest,
      access_token: this.getJwtToken( { id: user.id } )
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async finByUserID( userId: string ): Promise<User>{
    const user = await this.userModel.findById( userId );
    const { pass , ...rest } = user!.toJSON();
    return rest;
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
    const token = this.jwtService.sign(payload)
    if( !token ) throw new Error('Error al crear el token');
    return token;
  }
}
