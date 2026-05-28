import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  
  @IsNotEmpty({ message: 'Le champ ne doit pas être vide' })
  title!: string;

  
  @IsNotEmpty({ message: 'Le champ ne doit pas être vide' })
  content!: string;

  
  @IsNotEmpty({ message: 'Le champ ne doit pas être vide' })
  authorId!: number;
}
