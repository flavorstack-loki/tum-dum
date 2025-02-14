import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { SlickCarouselComponent } from "ngx-slick-carousel";
import { Observable } from "rxjs";
import { AppService } from "../services/app.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  @ViewChild("slickCarousel", { static: false })
  slickCarousel!: SlickCarouselComponent;
  @ViewChild("slickCarousel2", { static: false })
  slickCarousel2!: SlickCarouselComponent;
  ip: any;
  restaurantList: any;
  constructor(
    private http: HttpClient,
    private appService: AppService,
    private router: Router
  ) {}
  // slideConfig = {
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   dots: true,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };
  items: string[] = [];

  cuisinesList: any = [
    {
      item_id: 1,
      item_text: "Sandwich",
      image: "../../assets/dishImages/sandwich.png",
    },
    {
      item_id: 2,
      item_text: "Chicken Curry",
      image: "../../assets/dishImages/chicken curry.png",
    },
    {
      item_id: 3,
      item_text: "Shawarma",
      image: "../../assets/dishImages/shawarma.png",
    },
    {
      item_id: 4,
      item_text: "Rolls",
      image: "../../assets/dishImages/chicken kathi roll (1).png",
    },
    {
      item_id: 5,
      item_text: "Mutton Curry",
      image: "../../assets/dishImages/mutton curry.png",
    },
    {
      item_id: 6,
      item_text: "Korean",
      image: "../../assets/dishImages/korean food.png",
    },
    {
      item_id: 7,
      item_text: "Continental",
      image: "../../assets/dishImages/continental food.png",
    },
    {
      item_id: 8,
      item_text: "Fried Chicken",
      image: "../../assets/dishImages/fried chicken.png",
    },
    {
      item_id: 9,
      item_text: "Biryani",
      image: "../../assets/dishImages/biryani.png",
    },
    {
      item_id: 10,
      item_text: "Pizza",
      image: "../../assets/dishImages/pizza.png",
    },
    {
      item_id: 11,
      item_text: "Momo",
      image: "../../assets/dishImages/momos.png",
    },
    {
      item_id: 12,
      item_text: "Mughlai",
      image: "../../assets/dishImages/mughlai food.png",
    },
    {
      item_id: 13,
      item_text: "Grilled Chicken",
      image: "../../assets/dishImages/grilled chicken.png",
    },
    {
      item_id: 14,
      item_text: "Arabian Food",
      image: "../../assets/dishImages/arabian food.png",
    },
    {
      item_id: 15,
      item_text: "Mandi",
      image: "../../assets/dishImages/mandibiryani.png",
    },
    {
      item_id: 16,
      item_text: "Cake",
      image: "../../assets/dishImages/cake.png",
    },
    {
      item_id: 17,
      item_text: "Chinese",
      image: "../../assets/dishImages/noodles chinese.png",
    },
    {
      item_id: 18,
      item_text: "Burger",
      image: "../../assets/dishImages/burger.png",
    },
    {
      item_id: 19,
      item_text: "Paneer",
      image: "../../assets/dishImages/paneer curry.png",
    },
    {
      item_id: 20,
      item_text: "Boba",
      image: "../../assets/dishImages/boba tea.png",
    },
    {
      item_id: 21,
      item_text: "Odia",
      image: "../../assets/dishImages/odia food.png",
    },
    {
      item_id: 21,
      item_text: "Combo",
      image: "../../assets/dishImages/continental food.png",
    },
    {
      item_id: 22,
      item_text: "Dosa",
      image: "../../assets/dishImages/dosa.png",
    },
    {
      item_id: 23,
      item_text: "Healthy",
      image: "../../assets/dishImages/chicken kathi roll (1).png",
    },
    {
      item_id: 24,
      item_text: "North Indian",
      image: "../../assets/dishImages/north indian food.png",
    },
    {
      item_id: 25,
      item_text: "Sweets",
      image: "../../assets/dishImages/gulabjamun.png",
    },
    {
      item_id: 26,
      item_text: "Milk Shake",
      image: "../../assets/dishImages/milkshake.png",
    },
    {
      item_id: 27,
      item_text: "South Indian",
      image: "../../assets/dishImages/idli.png",
    },
    {
      item_id: 28,
      item_text: "Ice Cream",
      image: "../../assets/dishImages/ice cream.png",
    },
    {
      item_id: 29,
      item_text: "tea",
      image: "../../assets/dishImages/tea.png",
    },
    {
      item_id: 30,
      item_text: "Bakery",
      image: "../../assets/dishImages/bakery.png",
    },
    {
      item_id: 31,
      item_text: "Salads and Wraps",
      image: "../../assets/dishImages/salad.png",
    },
    {
      item_id: 32,
      item_text: "Cold Coffee",
      image: "../../assets/dishImages/cold coffee.png",
    },
    {
      item_id: 33,
      item_text: "Japanese",
      // image: "../../assets/dishImages/sushi.png",
      image: "../../assets/Images/sushi in a round plate top view only.png",
    },
    {
      item_id: 34,
      item_text: "Pav Bhaji",
      image: "../../assets/dishImages/paobhaji.png",
    },
    {
      item_id: 35,
      item_text: "Kulcha",
      image: "../../assets/dishImages/kulcha.png",
    },
    {
      item_id: 36,
      item_text: "Italian",
      image: "../../assets/dishImages/italian food.png",
    },
    {
      item_id: 37,
      item_text: "Pastry",
      image: "../../assets/dishImages/pastry.png",
    },
    {
      item_id: 38,
      item_text: "Pasta",
      image: "../../assets/dishImages/pasta.png",
    },
    {
      item_id: 39,
      item_text: "Soup",
      image: "../../assets/dishImages/soup.png",
    },
    {
      item_id: 40,
      item_text: "Desserts",
      image: "../../assets/dishImages/desserts.png",
    },
    {
      item_id: 41,
      item_text: "Khichde",
      image: "../../assets/dishImages/khichdi.png",
    },
    {
      item_id: 42,
      item_text: "Kebabs",
      image: "../../assets/dishImages/kebabs.png",
    },
    {
      item_id: 43,
      item_text: "Thali",
      image: "../../assets/dishImages/thali meal food.png",
    },
    {
      item_id: 44,
      item_text: "Cheesecake",
      image: "../../assets/dishImages/cheesecake.png",
    },
    {
      item_id: 45,
      item_text: "Fish",
      image: "../../assets/dishImages/fish tandoori.png",
    },
    {
      item_id: 46,
      item_text: "Chole Bhature",
      image: "../../assets/dishImages/chole bhature.png",
    },
  ];
  restaurants = [
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
    {
      image: "../../assets/Images/graphics (1).png",
      name: "Chinese Wok",
      rating: "4.3",
      time: "35-40 mins",
      details: "Chinese, Asian, Tibetan, Desserts",
      location: "Adigodi",
    },
  ];
  counter: number = 0;
  ngOnInit(): void {
    // this.getIpAddress();
    console.log("hiii");
    this.getRestaurants();
  }
  slideConfig = {
    slidesToShow: 4.5,
    slidesToScroll: 1,
    infinite: false,
    // centerMode: true,
    // centerPadding: "20px",
    arrows: false,
    // nextArrow:
    //   '<button class="slick-next" style="color: red !important">Next</button>',
    // prevArrow: '<button class="slick-prev">Prev</button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          // dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          // dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          // dots: true,
        },
      },
    ],
  };

  slideConfig2 = {
    slidesToShow: 8.5,
    slidesToScroll: 1,
    // dots: false,
    infinite: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // slideConfig2 = {
  //   slidesToShow: 8.5,
  //   slidesToScroll: 1,
  //   infinite: true, // Enabled infinite scrolling
  //   arrows: false, // Hides arrows if controlled externally
  //   responsive: [
  //     {
  //       breakpoint: 1200, // Large screens
  //       settings: {
  //         slidesToShow: 6,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 992, // Medium screens (tablets)
  //       settings: {
  //         slidesToShow: 5,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 768, // Small tablets
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 576, // Large mobile screens
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 400, // Small mobile screens
  //       settings: {
  //         slidesToShow: 1.5, // Keeps partial next slide visible
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };

  navigatePrev() {
    this.slickCarousel.slickPrev();
  }

  navigateNext() {
    this.slickCarousel.slickNext();
  }
  getIpAddress() {
    this.appService.getIpAddress().subscribe(
      (data: any) => {
        this.ip = data.ip;
      },
      (error: any) => {
        console.error("Error fetching IP address:", error);
        this.ip = "Unable to fetch IP";
      }
    );
  }

  addItems() {
    const newItem = `Item ${this.items.length + 1}`;
    this.items.push(newItem);
  }

  addItem() {
    this.counter = 1; // Initialize counter
  }

  increment() {
    this.counter++;
  }

  decrement() {
    if (this.counter > 1) {
      this.counter--;
    } else {
      this.counter = 0; // Reset to show "ADD +" button
    }
  }

  slickNext() {
    this.slickCarousel2.slickNext();
  }

  slickPrev() {
    this.slickCarousel2.slickPrev();
  }

  getRestaurants() {
    this.appService.getRestaurantLists().subscribe((res: any) => {
      this.restaurantList = res.map((restaurant: any) => ({
        ...restaurant,
        cuisinesList: restaurant.cuisinesList || [],
      }));
      console.log("this.restaurants", this.restaurantList);
    });
  }
  onResClick(itemId: any) {
    this.router.navigate(["home/restaurant_Detail", itemId]);
  }
}
