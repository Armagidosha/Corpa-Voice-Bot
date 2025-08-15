import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TrustedUser {
  @PrimaryColumn()
  trustedId: string;

  @ManyToOne(() => User, (user) => user.trustedUsers)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;
}
