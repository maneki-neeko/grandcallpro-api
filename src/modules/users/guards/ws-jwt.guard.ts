import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from '@users/dto/jwt-payload.interface';
import { UsersService } from '@users/services/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      this.logger.log('WsJwtGuard.canActivate sendo executado');
      
      const client: Socket = context.switchToWs().getClient<Socket>();
      this.logger.log(`Cliente conectado WS ID: ${client.id}`);
      
      // Log detalhado do handshake
      this.logger.log(`Handshake auth: ${JSON.stringify(client.handshake?.auth || {})}`);
      this.logger.log(`Handshake headers: ${JSON.stringify(client.handshake?.headers || {})}`);
      
      const token = this.extractTokenFromHeader(client);
      
      if (!token) {
        this.logger.warn('Token não encontrado no handshake');
        // Em vez de lançar uma exceção, podemos retornar false para permitir conexões anônimas
        // ou lançar uma exceção para bloquear completamente
        throw new WsException('Unauthorized access - Token não encontrado');
      }
      
      this.logger.log('Token encontrado, verificando...');
      
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        this.logger.log(`Token válido para usuário ID: ${payload.sub}`);
        
        // Validar se o usuário existe
        const user = await this.usersService.findOne(payload.sub);
        
        if (!user) {
          this.logger.warn(`Usuário ID ${payload.sub} não encontrado`);
          throw new WsException('Usuário não encontrado');
        }
        
        this.logger.log(`Usuário autenticado: ${user.name} (${user.level})`);
        
        // Anexar o usuário ao objeto de cliente para uso posterior
        client['user'] = user;
        
        return true;
      } catch (jwtError) {
        this.logger.error(`Erro na verificação do token: ${jwtError.message}`);
        throw new WsException('Token inválido ou expirado');
      }
    } catch (err) {
      this.logger.error(`Erro de autenticação: ${err.message}`);
      throw new WsException(`Unauthorized access: ${err.message}`);
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    // Extrair o token do handshake auth ou dos headers
    this.logger.log('Extraindo token do handshake...');
    
    // Verificar diferentes formatos de token no handshake
    let token: string | undefined;
    
    // 1. Verificar em client.handshake.auth.token
    if (client.handshake?.auth?.token) {
      this.logger.log('Token encontrado em handshake.auth.token');
      token = client.handshake.auth.token;
      // Se o token já tiver o formato Bearer, extrair apenas o token
      if (token.startsWith('Bearer ')) {
        token = token.substring(7);
      }
      return token;
    }
    
    // 2. Verificar em client.handshake.headers.authorization
    const authorization = client.handshake?.headers?.authorization;
    if (authorization) {
      this.logger.log('Token encontrado em handshake.headers.authorization');
      // Formato padrão: 'Bearer <token>'
      const [type, authToken] = authorization.split(' ');
      if (type === 'Bearer' && authToken) {
        return authToken;
      }
    }
    
    // 3. Verificar em client.handshake.query.token (formato alternativo)
    if (client.handshake?.query?.token) {
      this.logger.log('Token encontrado em handshake.query.token');
      return client.handshake.query.token as string;
    }
    
    this.logger.warn('Nenhum token encontrado no handshake');
    return undefined;
  }
}
