import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post')
export class PostEntity {
  constructor(id: number, title: string, content: string, authorId: number) {
    this.id = id;
    this.title = title;
    this.content =content;
    this.authorId = authorId;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  content: string;

  @Column()
  authorId: number;
}
