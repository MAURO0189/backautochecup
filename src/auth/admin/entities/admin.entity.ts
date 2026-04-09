import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 55, nullable: false })
  adminName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  uuid!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'admin', nullable: false })
  role!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
