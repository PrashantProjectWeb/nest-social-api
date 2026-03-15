import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  bio: string;

  @Column()
  profileImage : string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

}