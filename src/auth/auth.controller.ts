import { Body, Controller, Delete, ForbiddenException, Get, Headers, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ForgotPasswordDto, LoginAuthDto, RegisterAdminAuthDto, RegisterAuthDto, ResetPasswordDto, UpdateUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard, JwtGuard } from "./guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseInterceptors(AnyFilesInterceptor())
    @Post('user/signup')
    async userSignup(@Body() dto: RegisterAuthDto) {
        return this.authService.userSignup(dto);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('admin/signup')
    async adminSignup(
        @Body(new ValidationPipe({ transform: true })) dto: RegisterAdminAuthDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.authService.adminSignup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('login')
    async login(@Body() dto: LoginAuthDto) {
        return this.authService.signin(dto);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get('users')
    getUsers(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        return this.authService.getAllUsers(pageNumber, pageSize)
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get('admins')
    async getAdmins(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('search') search = ''
    ) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        return this.authService.getAllAdmins(pageNumber, limitNumber, search);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Put('admin/:id')
    async updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Partial<RegisterAdminAuthDto & { id: number }>,
    ) {
        return this.authService.updateAdmin(id, dto);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete('admin/:id')
    async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.authService.deleteAdmin(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('users/:id')
    @UseInterceptors(AnyFilesInterceptor())
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Req() req
    ) {
        return this.authService.putUser(id, req.body);
    }

    @Post('forgot-password')
    forgotPassword(
        @Body() dto: ForgotPasswordDto,
        @Headers('accept-language') rawLocale: string
    ) {
        const locale = rawLocale ? rawLocale.split(',')[0].split('-')[0] : 'az';
        return this.authService.forgotPassword(dto.email, locale);
    }


    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }

    @Get('check-token')
    async checkToken(@Query('token') token: string) {
        const valid = await this.authService.checkToken(token);
        return { valid };
    }


    @Delete("users/:id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        return this.authService.deleteUser(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req) {
        if (!req.user.id) {
            throw new ForbiddenException('User ID not found in token');
        }

        if (req.user.isAdmin) {
            return this.authService.getAdminById(req.user.id);
        }

        return this.authService.getUserById(req.user.id);
    }
    @UseGuards(JwtGuard)
    @Patch('users/password')
    @UseInterceptors(AnyFilesInterceptor())
    async updatePassword(@Req() req) {
        const userId = req.user.sub;
        const currentPassword = req.body['currentPassword'];
        const newPassword = req.body['newPassword'];
        return this.authService.updatePassword(userId, currentPassword, newPassword);
    }


}