import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { RestaurantDetailsComponent } from "./restaurant-details/restaurant-details.component";
import { CheckOutComponent } from "./check-out/check-out.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "home/restaurant_Detail/:id", component: RestaurantDetailsComponent },
  { path: "check_out", component: CheckOutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
