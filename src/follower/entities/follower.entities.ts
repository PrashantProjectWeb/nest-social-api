import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['follower', 'following'])
export class Follower {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'followingId' })
    following: User;


    @CreateDateColumn()
    createdAt: Date;

}