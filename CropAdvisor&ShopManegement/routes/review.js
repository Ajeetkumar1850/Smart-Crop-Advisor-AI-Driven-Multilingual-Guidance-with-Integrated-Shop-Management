const review = require("../models/review.js");
const reviewController =require("../controllers/reviews.js");


    //Post Review  Route
    router.post("/",
      isLoggedIn,
      validateReview, 
    wrapAsync(reviewController.createReview));
  
    //Delete review route 
          router.delete(
            "/:reviewId",
            isLoggedIn,
            isReviewAuthor,
            wrapAsync(reviewController.destroyReview)      
            );
    module.exports=router;