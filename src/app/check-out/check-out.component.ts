import { Component, NgZone, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { CartService } from "../services/cartServices/cart.service";
import { Timestamp, serverTimestamp } from "firebase/firestore"; // Correct import
@Component({
  selector: "app-check-out",
  templateUrl: "./check-out.component.html",
  styleUrl: "./check-out.component.scss",
})
export class CheckOutComponent implements OnInit {
  userId: string = "";
  cartItems: any[] = [];
  totalPrice: number = 0;
  resId: any;
  resDetails: any;
  checkedAgree: boolean = false;
  upiId: string = "";
  amount: string = "";
  transactionNote: string = "Payment for Order";
  orderId: string = "";
  totalQty: any = 0;
  isOpen = false;
  orderStatus: boolean = false;
  orderDetails: any;
  orderStatusInterval: any;
  orderType: any;
  isDeclined: boolean = false;
  paymentStatus: boolean = false;
  paymentAccepted: boolean = false;
  paymentPending: boolean = false;
  paymentDeclined: boolean = false;
  merchantName: string = "TUMDUM";
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
  ngOnInit(): void {
    this.checkLogin();
    this.getCartDetailsByUserId();
  }
  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
  closeModal2() {
    this.paymentStatus = false;
  }

  // payWithUPI() {
  //   this.closeModal();
  //   this.paymentStatus = true;
  //   const upiUrl = `upi://pay?pa=${this.upiId}&pn=Merchant+Name&tr=${this.orderId}&tn=${this.transactionNote}&am=${this.amount}&cu=INR`;
  //   //  const upiUrl = `upi://pay?pa=${this.upiId}&pn=Merchant+Name&tr=${this.orderId}&tn=${this.transactionNote}&am=${this.amount}&cu=INR&url=https://yourwebsite.com/payment-status`;
  //   window.location.href = upiUrl;
  //   // setTimeout(() => {
  //   //   // Redirect to a success/failure page after returning from UPI app
  //   //   this.createOrder();
  //   // }, 5000);
  // }

  payWithUPI() {
    this.closeModal();
    this.paymentStatus = true;

    if (this.isIOS()) {
      // iOS - Use Google Pay Web URL (since iOS doesn’t support `upi://`)
      const gpayUrl = `tez://upi/pay?pa=${encodeURIComponent(
        this.upiId
      )}&pn=${encodeURIComponent(this.merchantName)}&tr=${encodeURIComponent(
        this.orderId
      )}&am=${encodeURIComponent(this.amount)}&cu=INR`;
      // const phonePeDeepLink = `phonepe://pay?pa=${encodeURIComponent(
      //   this.upiId
      // )}&pn=${encodeURIComponent(
      //   this.merchantName
      // )}&mc=1234&tid=${encodeURIComponent(
      //   this.orderId
      // )}&tr=${encodeURIComponent(
      //   this.orderId
      // )}&tn=Payment&am=${encodeURIComponent(this.amount)}&cu=INR`;

      window.location.href = gpayUrl;
    } else {
      const upiUrl = `upi://pay?pa=${this.upiId}&pn=Merchant+Name&tr=${this.orderId}&tn=${this.transactionNote}&am=${this.amount}&cu=INR`;
      // Android - Use direct `upi://` deep link
      // const upiUrl = `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(
      //   this.merchantName
      // )}&tr=${this.orderId}&tn=${this.transactionNote}&am=${
      //   this.amount
      // }&cu=INR`;
      window.location.href = upiUrl;
    }

    // setTimeout(() => {
    //   // Redirect to payment status page
    //   this.createOrder();
    // }, 5000);
  }

  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  getCartDetailsByUserId() {
    let cartData: any;
    this.cartService
      .getCartDetailsDocumentById(this.userId)
      .subscribe((snapshot: any) => {
        cartData = snapshot.data();
        this.cartItems = cartData?.menuItems || [];
        this.resId = cartData?.resId;
        if (this.resId) {
          this.getResDetails();
        }
        // this.cartItemsMapper = cartData?.menuItems
        //   ? new Map(Object.entries(cartData.menuItems))
        //   : new Map();
        // if (cartData.resId == this.resId) {
        //   cartData?.menuItems?.forEach((ele: any) => {
        //     this.cartUpdate(ele, ele?.quantity, true);
        //   });
        // }
        console.log("cartDetails", this.cartItems);
        this.calTotalPrice();
      });
  }

  calTotalPrice() {
    this.cartItems.forEach((eachItem: any) => {
      this.totalPrice += eachItem?.addedQtyPrice;
      this.totalQty += eachItem?.quantity || 0;
    });
    console.log("totalPrice", this.totalPrice, this.totalQty);
  }

  getResDetails() {
    this.appService
      .getRestaurantDetailsDocumentById(this.resId)
      .subscribe((snapshot: any) => {
        this.resDetails = snapshot.data();
        this.upiId = this.resDetails?.upiId || "";
        this.merchantName = this.resDetails?.res_name;
        console.log("resDetails", this.resDetails);
      });
  }

  onChecked() {
    this.checkedAgree = !this.checkedAgree;
    if (this.checkedAgree == true) {
      this.orderType = "Resturant Pickup";
    } else {
      this.orderType = "Resturant Delivery";
    }
    console.log("checkedAgree", this.checkedAgree);
  }

  onGobackClick() {
    this.router.navigate(["home/restaurant_Detail", this.resId]);
  }
  // onOrder() {
  //   let fd = {
  //     customer_id: this.userId,
  //     menu_total_price: this.totalPrice,
  //     menu_total_quantity: this.totalQty,
  //     order_id: "",
  //     order_status: "",
  //     res_id: "",
  //     paymentStatus: "Pending",
  //     created_time: new Date().toISOString(),
  //   };
  //   console.log("fd", fd);
  //   const docRef = this.firestore
  //     .collection("customerOrders")
  //     .doc(this.userId?.toString())
  //     .set(fd)
  //     .then(() => {
  //       console.log("order Successfully Saved");
  //     })
  //     .catch((error) => {
  //       console.error("Firestore update error:", error);
  //     });
  // }

  async createOrder(): Promise<void> {
    this.openModal();
    const d = new Date();
    const orderId = d.getTime();
    this.orderId = orderId.toString();
    this.amount = this.totalPrice.toString();
    const batch = this.firestore.firestore.batch();
    // this.getOrderStatus(orderId);
    // return;
    const orderRef = this.firestore
      .collection("customerOrders")
      .doc(orderId.toString()).ref;
    // const totalPrice = items.reduce(
    //   (sum, item) => sum + item.price * item.quantity,
    //   0
    // );

    batch.set(orderRef, {
      customer_id: this.userId,
      menu_total_price: this.totalPrice,
      menu_total_quantity: this.totalQty,
      order_id: orderId.toString(),
      order_status: "Created",
      res_id: this.resId,
      paymentStatus: "Pending",
      orderType: "",
      created_time: new Date(),
      // created_time: Timestamp.now(),
    });

    this.cartItems.forEach((item: any) => {
      const itemRef = this.firestore.collection("orderMenuItems").doc().ref;
      batch.set(itemRef, {
        ...item,
        orderId: orderId.toString(),
        resId: this.resId,
      });
    });

    await batch.commit();
    this.orderStatusInterval = setInterval(() => {
      this.getOrderStatus(orderId);
    }, 2000);
  }

  getOrderStatus(orderId: any) {
    // orderId = "1739345735236";
    this.cartService.getOrderDetailsDocumentById(orderId.toString()).subscribe(
      (snapshot: any) => {
        this.orderDetails = snapshot.data();
        console.log("orderDetails", this.orderDetails);
        if (this.orderDetails?.order_status == "Accepted") {
          this.orderStatus = true;
          this.getPaymentStaus(orderId);
        } else if (this.orderDetails?.order_status == "Declined") {
          this.stopPolling();
          this.isDeclined = true;
        } else if (this.orderDetails?.order_status == "Failed") {
          this.getPaymentStaus(orderId);
        }
      },
      (error) => {
        console.error("Error fetching order status:", error);
      }
    );
  }
  getPaymentStaus(orderId: any) {
    this.cartService.getOrderDetailsDocumentById(orderId.toString()).subscribe(
      (snapshot: any) => {
        this.orderDetails = snapshot.data();
        console.log("orderDetails", this.orderDetails);
        if (this.orderDetails?.paymentStatus == "Pending") {
          this.paymentPending = true;
        } else if (this.orderDetails?.paymentStatus == "Paid") {
          this.paymentAccepted = true;
          this.paymentPending = false;
          this.paymentDeclined = false;
          this.stopPolling();
        } else if (this.orderDetails?.paymentStatus == "Unpaid") {
          this.paymentDeclined = true;
          this.paymentPending = false;
          this.paymentAccepted = false;
          this.stopPolling();
        }
      },
      (error) => {
        console.error("Error fetching order status:", error);
      }
    );
  }

  stopPolling(): void {
    if (this.orderStatusInterval) {
      clearInterval(this.orderStatusInterval);
      this.orderStatusInterval = null;
      console.log("Polling stopped"); // Debugging
    }
  }
  checkLogin() {
    let loginUser: any = sessionStorage.getItem("user");
    let loggedUser = JSON.parse(loginUser);
    this.userId = loggedUser?.uid.toString() || "";
    // this.userId = "FI1sl8HaEzgn3V5FA4h3RpbMxD63";
  }
}
