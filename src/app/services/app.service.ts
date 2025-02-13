import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private ipApiUrl = "https://geo.ipify.org?format=json";
  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    private router: Router
  ) {}

  getIpAddress(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>(this.ipApiUrl);
  }
  getRestaurantLists(): Observable<any[]> {
    return this.firestore
      .collection("registeredRestaurant")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getRestaurantMenuDetails(documentId: string): Observable<any[]> {
    return (
      this.firestore
        // .collection("registeredRestaurant")
        // .doc(documentId)
        .collection("restaurantMenu", (ref) =>
          ref.where("resId", "==", documentId)
        )
        .valueChanges()
    );
  }

  getRestaurantDetailsDocumentById(documentId: string) {
    return this.firestore
      .collection("registeredRestaurant")
      .doc(documentId)
      .get();
  }

  getRegUserDetailsDocumentById(documentId: string) {
    return (
      this.firestore
        // .collection("registeredRestaurant")
        // .doc(documentId)
        .collection("registeredUser", (ref) =>
          ref.where("phone", "==", documentId)
        )
        .valueChanges()
    );
  }
}
