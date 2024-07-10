import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

// Mocking JwtService
jest.mock('@nestjs/jwt');

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({});
    authGuard = new AuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true for valid token', async () => {
    const mockPayload = { userId: 1, username: 'testuser' };
    const mockToken = 'valid-token';
    const mockRequest: any = {
      headers: { authorization: `Bearer ${mockToken}` },
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

    const canActivateResult = await authGuard.canActivate({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any);

    expect(canActivateResult).toBeTruthy();
    expect(mockRequest.user).toEqual(mockPayload);
  });

  it('should throw UnauthorizedException for missing token', async () => {
    const mockRequest: any = {
      headers: { authorization: undefined },
    };

    try {
      await authGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as any);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const mockToken = 'invalid-token';
    const mockRequest: any = {
      headers: { authorization: `Bearer ${mockToken}` },
    };

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

    try {
      await authGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as any);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
