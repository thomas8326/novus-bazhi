import { 會員欄位 } from 'src/app/enums/會員.enum';

export interface Member {
  [會員欄位.Name]: string;
  [會員欄位.DateOfBirth]: string;
  [會員欄位.Gender]: '男' | '女';
}
