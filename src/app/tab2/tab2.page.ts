import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HiveService } from '../hive/services/hive.service';
import { Hive } from '../models/hive';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  hive: Hive;

  constructor(private route: ActivatedRoute, private hiveService: HiveService) {}

  ngOnInit(){
    this.route.data.subscribe(routeData => {
      this.hiveService.getHive(routeData.id).subscribe(hive => {
        this.hive = hive;
      });
    });
  }

}
