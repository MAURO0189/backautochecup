import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 55, nullable: false })
  username!: string;

  @Column({ type: 'varchar', length: 55, nullable: false })
  lastName!: string;

  @Column({ type: 'varchar', length: 13, nullable: false })
  identificationNumber!: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  phoneNumber!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  resetPasswordToken!: string | null;

  @Column({ type: 'datetime', nullable: true, default: null })
  resetPasswordExpires!: Date | null;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true })
  uuid!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'user',
    nullable: false,
  })
  role!: string;

  @Column({ type: 'date', nullable: true })
  birthDate!: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occupation!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  otherOccupation!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  howDidYouFindUs!: string | null;

  @Column({ type: 'longblob', nullable: true })
  avatarData!: Buffer | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  avatarMimeType!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
