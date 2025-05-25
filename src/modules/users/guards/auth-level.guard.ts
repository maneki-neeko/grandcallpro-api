import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  applyDecorators,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import UserLevel from '../entities/user-level';

// Key for storing user level metadata
export const USER_LEVELS_KEY = 'userLevels';

/**
 * Decorator to protect routes with both JWT authentication and user level authorization
 * @param levels The user levels that are allowed to access the route
 * @returns Decorator function that combines JWT authentication and user level authorization
 */
export const AuthLevel = (...levels: UserLevel[]) =>
  applyDecorators(UseGuards(AuthLevelGuard), SetMetadata(USER_LEVELS_KEY, levels));

@Injectable()
export class AuthLevelGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    // Get the required levels from both the handler and the controller
    const requiredLevels = this.reflector.getAllAndOverride<UserLevel[]>(USER_LEVELS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredLevels || requiredLevels.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRequiredLevel = requiredLevels.includes(user.level);

    if (!hasRequiredLevel) {
      throw new ForbiddenException(`Access denied. Required level: ${requiredLevels.join(' or ')}`);
    }

    return true;
  }
}
