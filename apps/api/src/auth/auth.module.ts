import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/JwtGuard'
import { JwtStrategy } from './guards/JwtStrategy'
import { TokenService } from './token.service'

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		AuthRepository,
		TokenService,
		JwtStrategy,
		JwtAuthGuard
	],
	exports: [AuthService, JwtAuthGuard]
})
export class AuthModule {}
