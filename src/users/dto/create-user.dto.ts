import { IsEmail, IsNotEmpty, IsString ,MinLength, IsOptional , IsBoolean, IsUUID} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @MinLength(3)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(2)
    username: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    mobileNumber?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    avatar?: string;

}
