import { Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { TrustedUser } from './trustedUser.entity';
import { BlockedUser } from './blockedUser.entity';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;

  @OneToOne(() => Channel, (channel) => channel.owner)
  channel: Channel;

  @OneToMany(() => TrustedUser, (trusted) => trusted.owner)
  trustedUsers: TrustedUser[];

  @OneToMany(() => BlockedUser, (blocked) => blocked.owner)
  blockedUsers: BlockedUser[];
}
