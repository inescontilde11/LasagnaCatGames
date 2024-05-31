import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-donate-dialog',
  templateUrl: './donate-dialog.component.html',
  styleUrl: './donate-dialog.component.css'
})
export class DonateDialogComponent {
  title: string = '';

  constructor(public dialogRef: MatDialogRef<DonateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
    this.title = data.title;
  }

  closeDialog(response: boolean) {
    this.dialogRef.close(response);
  }
}
