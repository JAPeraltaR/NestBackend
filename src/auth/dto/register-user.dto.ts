import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterUserDto{
    
    @IsEmail()
    @IsNotEmpty()
    email:      string;

    @IsString()
    @IsNotEmpty()
    name:       string;

    @MinLength(6)
    @IsNotEmpty()
    pass:       string;
    
}