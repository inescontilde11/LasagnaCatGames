import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.css'
})
export class YesNoDialogComponent {

  title: string = '';

  constructor(public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
    this.title = data.title;
  }

  closeDialog(response: boolean) {
    this.dialogRef.close(response);
  }
}
