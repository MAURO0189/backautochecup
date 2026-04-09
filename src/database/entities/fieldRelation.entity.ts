import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FIELD_TYPES {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
}

@Entity()
export class FieldRelation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column()
  entity!: string;

  @Column({ type: 'enum', enum: FIELD_TYPES })
  type!: FIELD_TYPES;

  @Column()
  field!: string;

  @Column({ nullable: true })
  group!: string | null;

  @Column()
  fieldCode!: string;
}
