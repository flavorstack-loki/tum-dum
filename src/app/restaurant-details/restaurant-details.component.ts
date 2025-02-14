import { Component, Input, NgZone, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../services/cartServices/cart.service";
import { AppService } from "../services/app.service";

@Component({
  selector: "app-restaurant-details",
  templateUrl: "./restaurant-details.component.html",
  styleUrl: "./restaurant-details.component.scss",
})
export class RestaurantDetailsComponent implements OnInit {
  // @Input() rating: number = 4.3;
  // @Input() reviews: number = 913;
  // @Input() costForTwo: string = "₹200 for two";
  // @Input() name: string = "Hotel Sai Nath & Sai Restaurant";
  // @Input() tags: string[] = [
  //   "North Indian",
  //   "North Indian",
  //   "North Indian",
  //   "North Indian",
  // ];
  userId: string = "";
  menuData: any;
  resId: any;
  path: any;
  resDetails: any;
  cartItemsMapper = new Map();
  itemsAdded: number = 0;
  categoryMapper = new Map();
  array = Array;
  activeCat: any;
  constructor(
    // private apiService: ApiService,
    // private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
    private firestore: AngularFirestore,
    private cartService: CartService,
    private appService: AppService // private toastr: ToastrService
  ) {}
  showNotification = false;
  itemCount = 0;
  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param: any) => {
      this.resId = param.get("id") || 0;
      this.path = this.activeRoute.snapshot.paramMap.get("path");
      // console.log("path", this.path);
      this.checkLogin();
      this.getRestaurantDetails();
      this.getCartDetailsByUserId();
      console.log("this.resId ", this.resId);
    });
    this.cartService.cartCount$.subscribe((count) => {
      this.itemCount = count;
      this.showNotification = true;

      // setTimeout(() => {
      //   this.showNotification = false;
      // }, 3000); // Hide after 3 seconds
    });
    this.getAllMenu();
  }
  addToCart() {
    this.cartService.addItem(); // Calls the service globally
  }

  getCartDetailsByUserId() {
    let cartData: any;
    this.cartService
      .getCartDetailsDocumentById(this.userId)
      .subscribe((snapshot: any) => {
        cartData = snapshot.data();
        // this.cartItemsMapper = cartData?.menuItems
        //   ? new Map(Object.entries(cartData.menuItems))
        //   : new Map();
        if (cartData.resId == this.resId) {
          cartData?.menuItems?.forEach((ele: any) => {
            this.cartUpdate(ele, ele?.quantity, true);
          });
        }
        console.log("cartDetails", cartData);
      });
  }

  getAllMenu() {
    if (this.resId) {
      this.appService.getRestaurantMenuDetails(this.resId).subscribe(
        (data: any) => {
          this.menuData = data;
          data?.forEach((element: any) => {
            let elementByCategory =
              this.categoryMapper?.get(element.categoryName) || [];
            elementByCategory.push(element);
            this.categoryMapper.set(element.categoryName, elementByCategory);
          });
          this.onCatClick(data[0].categoryName);
          console.log("getMenuData", data);
        },
        (error: any) => {
          console.error("Error fetching items:", error);
        }
      );
    } else {
      console.error("Something Went Wrong");
    }
  }
  getRestaurantDetails() {
    this.appService
      .getRestaurantDetailsDocumentById(this.resId)
      .subscribe((snapshot: any) => {
        this.resDetails = snapshot.data();
        console.log("resDetails", this.resDetails);
      });
  }

  updateCart(quantity: number) {
    this.cartService.addItem();
    console.log("Cart updated, Quantity:", quantity);
  }

  cartUpdate(item: any, quantity: number, isFirst = false) {
    if (this.userId == "") {
      alert("Please Signin to add item to cart");
      return;
    }
    const date = new Date();
    if (item.resId !== this.resId) {
      this.cartItemsMapper = new Map();
      this.itemsAdded = 0;
    }
    let updatedItem = this.cartItemsMapper?.get(item.id) || item;
    updatedItem = {
      ...updatedItem,
      quantity:
        updatedItem.quantity && !isFirst
          ? +updatedItem.quantity + quantity
          : quantity,
    };
    if (updatedItem.quantity) {
      updatedItem.addedQtyPrice =
        updatedItem.item_discounted_price * updatedItem.quantity;
      this.cartItemsMapper.set(updatedItem.id, updatedItem);
    } else {
      this.cartItemsMapper.delete(updatedItem.id);
    }
    console.log("updatedItem", this.cartItemsMapper);
    // this.cartService.addItem();
    this.itemsAdded = this.itemsAdded + quantity;

    this.calTotalPrice();
    if (isFirst) return;

    let fd = {
      menuItems: Array.from(this.cartItemsMapper.values()),
      resId: this.resId,
      userId: this.userId,
      createdDate: date.toISOString(),
    };
    const docRef = this.firestore
      .collection("userCart")
      .doc(this.userId?.toString())
      .set(fd)
      .then(() => {
        this.showNotification = true;
        // setTimeout(() => (this.showNotification = false), 3000);
      })
      .catch((error) => {
        console.error("Firestore update error:", error);
      });
  }
  calTotalPrice() {
    let totalPrice: number = 0;
    Array.from(this.cartItemsMapper.values()).forEach((eachItem: any) => {
      totalPrice += eachItem?.addedQtyPrice;
    });
    console.log("totalPrice", totalPrice);
  }

  onCatClick(cat: any) {
    this.activeCat = cat;
    document.getElementById(cat)?.scrollIntoView({ behavior: "smooth" });
  }
  checkLogin() {
    let loginUser: any = sessionStorage.getItem("user");
    let loggedUser = JSON.parse(loginUser);
    this.userId = loggedUser?.uid.toString() || "";
    // this.userId = "064POlUc9DPGRJLnRK6CkLpTs1u2";
  }
}
