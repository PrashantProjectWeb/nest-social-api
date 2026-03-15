import { 
Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique
} from 'typeorm'


@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('User', 'comments')
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne('Post', 'comments')
  @JoinColumn({ name: 'postId' })
  post: any;

}