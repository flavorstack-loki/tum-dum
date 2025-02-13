import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs/operators";
import { AppService } from "src/app/services/app.service";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"], // Fixed 'styleUrl' to 'styleUrls'
})
export class NavbarComponent implements OnInit {
  public registerForm!: FormGroup;
  otpCode: string = "";
  otpSent: boolean = false;
  loginForm: any;
  registerOTPForm: any;
  loginOTPForm: any;
  logged: boolean = false;
  loggedUser: any;
  alreadyuser: any;
  @ViewChild("otpModal1") otpModalRef!: ElementRef;
  userId: any;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
    private firestore: AngularFirestore,
    private appService: AppService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      phone: ["", [Validators.required]],
    });
    this.loginForm = this.formBuilder.group({
      loginPhone: ["", [Validators.required]],
    });
    this.registerOTPForm = this.formBuilder.group({
      regOTP: ["", [Validators.required]],
    });
    this.loginOTPForm = this.formBuilder.group({
      logOTP: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  // Send OTP
  async sendOtp(reg: any, ref: any) {
    if (reg == true) {
      if (this.registerForm.invalid) {
        alert("Please enter a valid phone number.");
        return;
      }
      this.appService
        .getRegUserDetailsDocumentById(
          this.registerForm.value["phone"].toString()
        )
        .pipe(take(1))
        .subscribe(async (data: any) => {
          console.log("try", data);
          this.alreadyuser = data;
          if (data.length > 0) {
            alert("You have already registered with us.Please Login");
            return;
          }
          ref.click();
          await this.authService.initializeRecaptcha("recaptcha-container");

          try {
            console.log("ph", +91 + this.registerForm.value["phone"]);

            await this.authService.sendOtp(
              "+91" + this.registerForm.value["phone"].toString()
            );

            this.otpSent = true;
            alert("OTP sent successfully!");
          } catch (error) {
            alert("Failed to send OTP. Try again.");
          }
        });
    } else {
      if (this.loginForm.invalid) {
        alert("Please enter a valid phone number.");
        return;
      }
      this.appService
        .getRegUserDetailsDocumentById(
          this.loginForm.value["loginPhone"].toString()
        )
        .pipe(take(1))
        .subscribe((data: any) => {
          console.log("try", data);
          this.alreadyuser = data;
          if (data.length < 1) {
            alert("You have not registered with us.Please Register");
            return;
          }
          ref.click();
          this.otpFun();
        });
    }
  }

  async otpFun() {
    this.authService.initializeRecaptcha("recaptcha-container");

    try {
      console.log("Logph", +91 + this.loginForm.value["loginPhone"]);

      await this.authService.sendOtp(
        "+91" + this.loginForm.value["loginPhone"].toString()
      );

      // this.otpSent = true;
      alert("OTP sent successfully!");
    } catch (error) {
      alert("Failed to send OTP. Try again.");
    }
  }

  // Verify OTP
  async verifyOtp() {
    // if (!this.otpCode) {
    //   alert("Please enter the OTP");
    //   return;
    // }

    try {
      const user: any = await this.authService.verifyOtp(this.otpCode);
      alert("Phone verified successfully! 🎉");
      console.log("User:", user);
      // Optionally, navigate to another page or save user data here
      // this.router.navigate(['/some-other-page']);
    } catch (error) {
      alert(`Invalid OTP. Please try again${error}`);
    }
  }

  // // Sign up
  // signUp() {
  //   if (this.registerForm.invalid) {
  //     alert("Please fill in all fields correctly.");
  //     return;
  //   }

  //   let fd = {
  //     firstName: this.registerForm.value["firstName"],
  //     lastName: this.registerForm.value["lastName"],
  //     phone: this.registerForm.value["phone"],
  //   };

  //   console.log("Form Data:", fd);
  //   // You can save this data to the Firestore or proceed further with the user signup logic
  //   // Example: this.firestore.collection('users').add(fd);
  // }

  signUp(ref: any) {
    console.log("this.otpCode", this.registerOTPForm.value["regOTP"]);
    this.otpCode = this.registerOTPForm.value["regOTP"];
    // if (this.registerForm.invalid) {
    //   alert("Please fill in all fields correctly.");
    //   return;
    // }

    // if (!this.otpSent || !this.otpCode) {
    //   alert("Please verify your phone number with the OTP.");
    //   return;
    // }

    // Step 1: Verify OTP
    this.authService
      .verifyOtp(this.otpCode)
      .then((user: any) => {
        //  const otpModal = document.getElementById("otpModal1");
        //  if (otpModal) {
        //    const modalInstance = bootstrap.Modal.getInstance(otpModal);
        //    modalInstance?.hide();
        //  }
        // Step 2: If OTP is verified, save user data to Firestore
        const userData: any = {
          firstName: this.registerForm.value["firstName"],
          lastName: this.registerForm.value["lastName"],
          phone: this.registerForm.value["phone"],
          uid: user.uid, // Store Firebase UID from the verification
          createdAt: new Date(),
        };
        console.log("userData", userData);
        // return;
        // Step 3: Save user to Firestore (or your preferred database)
        this.firestore
          .collection("registeredUser")
          .doc(user.uid)
          .set(userData)
          .then(() => {
            sessionStorage.setItem("user", JSON.stringify(userData));
            alert("User signed up successfully!");
            ref.click();
            // Step 4: Optionally, navigate to the home page or dashboard after successful signup
            // this.router.navigate(["/home"]); // Example route
            this.checkLogin();
          })
          .catch((error) => {
            console.error("Error saving user data:", error);
            alert("Failed to save user data. Please try again.");
          });
      })
      .catch((error) => {
        console.error("OTP verification failed:", error);
        alert("Invalid OTP. Please try again.");
      });
  }

  checkLogin() {
    let loginUser: any = sessionStorage.getItem("user");
    this.loggedUser = JSON.parse(loginUser);
    if (this.loggedUser) {
      this.userId = this.loggedUser?.uid;
      this.logged = true;
    } else {
      this.userId = "";
      this.logged = false;
    }
  }

  onLoginOtpVerification(ref: any) {
    let code = this.loginOTPForm.value["logOTP"];
    console.log("code", code);
    this.authService.verifyOtp(code).then((user: any) => {
      console.log("login User", user);
      sessionStorage.setItem("user", JSON.stringify(user));
      ref.click();
      this.checkLogin();
    });
  }
  onLogout() {
    sessionStorage.clear();
    this.logged = false;
    this.checkLogin();
  }
  onCartClick() {
    if (this.userId) {
      this.router.navigate(["/check_out"]);
    } else {
      alert("Please Signin first");
    }
  }
}
