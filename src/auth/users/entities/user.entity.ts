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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
