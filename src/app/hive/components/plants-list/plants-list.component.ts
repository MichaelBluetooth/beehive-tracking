import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ALL_PLANTS } from "src/app/models/plants";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-plants-list",
  templateUrl: "./plants-list.component.html",
  styleUrls: ["./plants-list.component.scss"],
})
export class PlantsListComponent implements OnInit {
  @Input() selectedPlants = [];
  @Output() selectedPlantsChange = new EventEmitter<string[]>();

  plants: { label: string; selected: boolean }[] = [];

  constructor(private modal: ModalController) {}

  ngOnInit() {
    this.plants = ALL_PLANTS.map((plant) => {
      return {
        label: plant,
        selected: this.selectedPlants.indexOf(plant) > -1,
      };
    });
  }

  save(): void {
    this.selectedPlantsChange.emit(this.plants.map((p) => p.label));
    this.modal.dismiss(
      this.plants.filter((p) => p.selected).map((p) => p.label)
    );
  }
}
