import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouteStation } from "@client/shared-models";

export interface DialogData {
  stations: RouteStation[];
}

@Component({
  selector: 'app-trip-overview-dialog',
  templateUrl: './trip-overview-dialog.component.html',
  styleUrls: ['./trip-overview-dialog.component.scss']
})
export class TripOverviewDialogComponent {
  public data: DialogData = inject(MAT_DIALOG_DATA);
}
