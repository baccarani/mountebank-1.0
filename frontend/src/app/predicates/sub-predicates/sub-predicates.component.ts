import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ImposterService } from "src/app/services/imposter.service";

@Component({
  selector: "app-sub-predicates",
  templateUrl: "./sub-predicates.component.html",
  styleUrls: ["./sub-predicates.component.css"],
})
export class SubPredicatesComponent implements OnInit {
  @Input() index: number = 0;

  // subPredicateForm = this.formBuilder.group({
  //   operator: ['']
  // });

  operator = [
    { id: 1, name: "equals" },
    { id: 2, name: "deepEquals" },
    { id: 3, name: "contains" },
    { id: 4, name: "startsWith" },
    { id: 5, name: "endsWith" },
    { id: 6, name: "matches" },
    { id: 7, name: "exists" },
    { id: 11, name: "inject" },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private imposterService: ImposterService,
  ) {}

  ngOnInit() {
    // this.subPredicateForm.valueChanges.subscribe(value => {
    //   this.getOperator();
    // })
  }

  onSubmit() {}

  onDelete() {}

  // getOperator() {
  //   this.imposterService.setOperator(this.subPredicateForm.value.operator);
  // }
}
