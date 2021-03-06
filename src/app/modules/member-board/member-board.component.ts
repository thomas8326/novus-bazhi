import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { OpenDialogService } from 'src/app/modules/dialog-template/open-dialog.service';
import { FortunetellingType, 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { Member } from 'src/app/interfaces/會員';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MemberService } from 'src/app/services/member/member.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ExportPdfService } from 'src/app/services/export-pdf/export-pdf.service';

const moment = _rollupMoment || _moment;

const SELECT_YEARS = (currentYear: number) => {
  const years: number[] = [];
  let startYear = currentYear - 5;
  const endYear = currentYear + 20;

  while (startYear <= endYear) {
    years.push(startYear++);
  }

  return years
}

@UntilDestroy()
@Component({
  selector: 'app-member-board',
  templateUrl: './member-board.component.html',
  styleUrls: ['./member-board.component.scss'],
})
export class MemberBoardComponent implements OnInit {
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.memberDataSource) {
      this.memberDataSource.sort = value;
      this.memberDataSource.sortData(this.memberDataSource.data, this.memberDataSource.sort);
    }
  }

  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;

  isAddingStatus = false;
  isEditingStatus = false;
  searchText: string = '';

  memberDataSource = new MatTableDataSource<Member>();

  memberForm = this.fb.group({
    [會員欄位.ID]: [''],
    [會員欄位.Name]: ['', Validators.required],
    [會員欄位.FacebookAccount]: [''],
    [會員欄位.Gender]: ['', Validators.required],
    [會員欄位.DateOfBirth]: [moment(), Validators.required],
    [會員欄位.FortunetellingType]: [FortunetellingType.detail],
    [會員欄位.AtYear]: [new Date().getFullYear()],
    [會員欄位.Completed]: [false],
  });

  readonly Member = 會員欄位;
  readonly MemberGender = 性別;
  readonly FortunetellingType = FortunetellingType;
  readonly yearOptions = SELECT_YEARS(new Date().getFullYear());

  readonly displayedColumns: string[] = [
    會員欄位.Name,
    會員欄位.FacebookAccount,
    會員欄位.Gender,
    會員欄位.DateOfBirth,
    會員欄位.FortunetellingType,
    會員欄位.AtYear,
    會員欄位.Completed,
    'btnGroup',
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly openDialogService: OpenDialogService,
    private readonly exportPdfService: ExportPdfService,
    private readonly snackbarService: SnackbarService,
  ) {
  }

  ngOnInit(): void {
    this.memberService.get().subscribe((members) => {
      this.memberDataSource.data = members.sort(this.compareCreateTime);
    });
  }

  onFilter(value: string) {
    this.searchText = value;
  }

  onEnterAddMemberMode() {
    this.resetForm();
    this.isEditingStatus = false;
    this.isAddingStatus = true;
  }

  onEnterEditMemberMode(target: Member) {
    this.isEditingStatus = true;
    this.isAddingStatus = false;
    this.memberForm.patchValue(target);
  }

  onImportExcel(files: FileList | null) {
    this.exportPdfService.importExcel(files).then((data: Member[]) => {
      for (let i = 0; i < data.length; i++) {
        this.addMember(data[i]);
      }
    }).catch(e => this.snackbarService.showWarning(e));
    this.inputFile.nativeElement.value = "";
  }

  onAddMember(isAddNext: boolean) {
    if (this.memberForm.valid) {
      this.addMember(this.memberForm.value);
      this.isAddingStatus = isAddNext;
      this.memberForm.reset();
    }
  }

  onUpdateMember() {
    if (this.memberForm.valid) {
      const updatedMember = new Member(this.memberForm.value);
      this.memberDataSource.data = this.memberDataSource.data.map((member) => (member.id === updatedMember.id ? updatedMember : member));
      this.updateMember(updatedMember);
      this.isEditingStatus = false;
    }
  }

  onDeleteMember(target: Member) {
    this.memberDataSource.data = this.memberDataSource.data.filter((member) => member.id !== target.id);
    this.memberService.delete(target.id);
  }

  onEditDetail(target: Member) {
    this.openDialogService.openMemberEditDetailDialog(target, (member: Member) => this.updateMember(member));
  }

  onCancel() {
    this.isEditingStatus = false;
    this.isAddingStatus = false;
    this.resetForm();
  }

  onRedirect(target: Member) {
    this.router.navigate([`horoscope/${target.id}`], { relativeTo: this.activatedRoute });
  }

  onCheckCompleted(id: string, isChecked: boolean) {
    this.memberService.replace(id, { completed: isChecked });
  }

  onUpdateComment(id: string, text: string) {
    this.memberService.replace(id, { comment: text });
  }

  private updateMember(member: Member) {
    this.memberService.replace(member.id, member);
  }

  private compareCreateTime(m1: Member, m2: Member) {
    const m1CreateTime = m1.createTime;
    const m2CreateTime = m2.createTime;

    return m1CreateTime > m2CreateTime && !m1.completed ? -1 : 1
  };

  private resetForm() {
    this.memberForm.reset();
    this.memberForm.patchValue({ dob: moment(), fortunetellingType: FortunetellingType.detail, atYear: new Date().getFullYear() });
  }

  private addMember(member: Member) {
    const newMember = new Member(member);
    this.memberService.create(newMember);
    this.memberDataSource.data = [newMember].concat(this.memberDataSource.data);
  }
}
