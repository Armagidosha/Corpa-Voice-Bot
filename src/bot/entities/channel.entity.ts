import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Channel {
  @PrimaryColumn()
  channelId: string;

  @Column()
  index: string;

  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.channel, { nullable: true })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'userId' })
  owner: User;

  @Column({ nullable: true })
  ownerId: string;
}
