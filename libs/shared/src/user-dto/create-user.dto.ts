import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Le champ doit être un nom valide' })
  @IsNotEmpty({ message: 'Le champ ne doit pas être vide' })
  name!: string;

  @IsEmail({}, { message: 'Le champ doit être un email valide' })
  @IsNotEmpty({ message: 'Le champ ne doit pas être vide' })
  email!: string;

  @IsString({ message: 'Le champ doit être un mot de passe valide' })
  @IsNotEmpty({ message: 'Le champ ne doit pas être vide' })
  password!: string;
}
