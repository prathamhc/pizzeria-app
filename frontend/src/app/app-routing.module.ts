import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { BuildPizzaComponent } from './components/build-pizza/build-pizza.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"menu", component:MenuComponent},
  {path:"build", component:BuildPizzaComponent},
  {path:"cart", component:CartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
