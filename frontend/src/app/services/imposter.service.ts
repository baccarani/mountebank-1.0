import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Predicate } from '../models/predicate';

@Injectable()
export class ImposterService {
    private imposterArray: any = null;
    private predicates: Predicate[] = [];


    constructor(private http: HttpClient) { }

    

    onGetPredicates() {
        return this.predicates.slice();
    }

    onAddPredicate({method, path}: Predicate) {
        this.predicates.push({method, path});
    }

    onResetPredicates() {
        this.predicates = [];
    }

    onGetImposter() {
        let imposterArray$ = [];
        this.imposterArray = this.http
            .get(`http://localhost:5000/imposters`)
            .pipe(map((responseData) => {
                this.imposterArray = responseData;
                this.imposterArray = this.imposterArray.imposters;
                for (let index = 0; index < this.imposterArray.length; index++) {
                    this.http.get(`http://localhost:5000/imposters/${this.imposterArray[index].port}`).subscribe(data => {
                        imposterArray$.push(data);
                        imposterArray$.sort((a,b) => a.port - b.port);
                    })
                }
                return this.imposterArray = imposterArray$;
            }))
            return this.imposterArray;


        // let imposterArrayMaster = [];
        // this.imposterArray = this.http
        //     .get(`http://localhost:5000/imposters`)
        //     .pipe(map((responseData) => {
        //         this.imposterArray = responseData;
        //         this.imposterArray = this.imposterArray.imposters;
        //         for (let index = 0; index < this.imposterArray.length; index++) {
        //             this.http.get(`http://localhost:5000/imposters/${this.imposterArray[index].port}`).subscribe(data => {
        //                 imposterArrayMaster.push(data);
        //             })
        //         }
        //         return this.imposterArray = imposterArrayMaster;
        //     }));


        // return this.imposterArray

    }

    onViewImposter(data) {
        return this.http
            .get(`http://localhost:5000/imposters/${data}`)
    }


    onDeleteImposter(port, index) {
        this.http
            .delete(`http://localhost:5000/imposters/${port}`)
            .subscribe(data => {
                this.imposterArray.splice(index, 1);
            })
    }


    // onAddImposter(data) {
    //     this.http
    //         .post(`http://localhost:5000/imposters`, data)
    //         .subscribe(responseData => {
    //             this.imposterArray.push(responseData);
    //             this.imposterArray.sort((a, b) => {
    //                 return a.port - b.port;
    //             });
    //         });
    // }


    createImposter(formValues) {
        const headers = JSON.parse(formValues.headers);
        const body = JSON.parse(formValues.body);
        const data = {
            port: formValues.port,
            protocol: formValues.protocol,
            name: formValues.name,
            stubs: [
                {
                    responses: [{
                        is: {
                            statusCode: formValues.statusCode,
                            headers: headers,
                            body: body
                        }
                    }],
                    predicates: [{
                        and: [{
                            equals: {
                                method: formValues.method,
                                path: formValues.path
                            }
                        }]
                    }]
                }]
        };

        this.http
            .post(`http://localhost:5000/imposters`, data)
            .subscribe(responseData => {
                this.imposterArray.push(responseData);
                this.imposterArray.sort((a, b) => {
                    return a.port - b.port;
                });
            });
    }
}



