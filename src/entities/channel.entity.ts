import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TrustedUser } from './user.entity';

@Entity()
export class Channel {
  @PrimaryColumn()
  channelId: string;

  @Column()
  ownerId: string;

  @Column()
  channelIndex: string;

  @Column()
  channelName: string;

  @Column()
  privacy: 'private' | 'public';

  @OneToMany(() => TrustedUser, (user) => user.channel)
  trustedId: TrustedUser[];
}
