import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { Payload } from 'src/auth/interface/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(  private jwtService: JwtService,
                private authService: AuthService
   ){}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if( !token ) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<Payload>(
        token, { secret: process.env.JWT_SEED }
      );
      const user = await this.authService.finByUserID( payload.id );
      if( !user ) throw new UnauthorizedException('Usuaio no existe');
      if( !user.isActive ) throw new UnauthorizedException('Usuaio no esta Activo');
      console.log(user);
      
      request['user'] = user;  
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
    
    return Promise.resolve(true);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
