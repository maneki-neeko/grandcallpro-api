import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from '@users/dto/jwt-payload.interface';
import { UsersService } from '@users/services/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHeader(client);
      
      if (!token) {
        throw new WsException('Unauthorized access');
      }
      
      const payload = this.jwtService.verify<JwtPayload>(token);
      
      // Validar se o usuário existe
      const user = await this.usersService.findOne(payload.sub);
      
      // Anexar o usuário ao objeto de cliente para uso posterior
      client['user'] = user;
      
      return true;
    } catch (err) {
      throw new WsException('Unauthorized access');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    // Extrair o token do handshake auth ou dos headers
    const authorization = 
      client.handshake?.auth?.token || 
      client.handshake?.headers?.authorization;
    
    if (!authorization) {
      return undefined;
    }
    
    const [type, token] = authorization.split(' ');
    
    return type === 'Bearer' ? token : undefined;
  }
}
