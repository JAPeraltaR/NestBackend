import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class RegisterUserDto{
    
    @IsString()
    @IsNotEmpty()
    name:          string;

    @IsString()
    @IsNotEmpty()
    lastName:      string;
    
    @IsEmail()
    @IsNotEmpty()
    email:         string;

    @IsOptional()
    @IsString()
    @Length(0,9)
    tel:           string;

    @IsNotEmpty()
    @MinLength(9)
    cel:           string;

    @IsNotEmpty()
    user:          string;

    @IsNotEmpty()
    @MinLength(6)
    pass:          string;
    
}