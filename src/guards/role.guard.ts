import { CanActivate, ExecutionContext } from '@nestjs/common';

export class RoleGuard implements CanActivate {
  private role: string;

  constructor(role: string) {
    this.role = role;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { user } = request;
    const userRole = user ? user.role : 'guest';
    console.log(userRole);
    return this.role === userRole;
  }
}
