import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Predicate } from '../models/predicate';
import { Response } from '../models/response';
import { ImposterService } from '../services/imposter.service';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.css']
})
export class AddDependencyComponent implements OnInit {
  protocols = ['http', 'https', 'tcp']
  methods = ['GET', 'POST', 'PUT']
  stubs = []
  predicates: Predicate[] = [];
  responses: Response[] = [];
  showEdit: boolean[] = [];





  constructor(private http: HttpClient, private fb: FormBuilder,private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  @Input() index: number = 0;

  dependencyForm = this.fb.group({
    name: [''],
    port: [''],
    protocol: [''],
    headers: [''],
    body: ['']
  });

  ngOnInit(): void {
    this.imposterService.onResetPredicates()
    if (this.imposterService.onGetPredicates().length === 0) {
      this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''})
    }
    this.predicates = this.imposterService.onGetPredicates();
  }

  predicateUpdate(form: any): void {
    this.showEdit[form.index] = true;
    this.predicates[form.index] = form.value;
  }


  closeModal() {
    this.matDialogRef.close();
  }


  onSubmit() {
    this.imposterService.onCreateImposter(this.dependencyForm.value);
    this.matDialogRef.close();
  }

  addPredicate() {
    this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''})
    this.showEdit.push(false);
    this.predicates = this.imposterService.onGetPredicates();
  }

  deleteUpdate(index: any): void {
    let tempPredicates: Predicate[] = [];
    for (let i = 0; i < this.predicates.length; i++) {
      if (i !== index) {
        tempPredicates.push(this.predicates[i]);
      }
    }
    this.predicates = tempPredicates;

    let tempEdit: boolean[] = [];
    for (let i = 0; i < this.showEdit.length; i++) {
      if (i !== index) {
        tempEdit.push(this.showEdit[i]);
      }
    }
    this.showEdit = tempEdit;

    this.imposterService.onDeletePredicate(index);
  }

  onDelete() {
    this.deleteUpdate(this.index);
  }

}
