import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class BlockedUser {
  @PrimaryColumn()
  blockedId: string;

  @ManyToOne(() => User, (user) => user.blockedUsers)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;
}
