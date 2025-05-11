const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Subscribe } = require("../Models/subscribe"); // Import Subscribe schema
const { Basic, Intermediate, Advanced } = require("../Models/subscribe"); // Import plan schemas
const User = require("../Models/User");

// 1️⃣ Initiate Subscription Payment
router.post("/subscribe", async (req, res) => {
  try {
    const { userId, planType } = req.body;
    console.log("Subscribe API called with:", { userId, planType });

    if (!userId || !planType) {
      return res.status(400).json({ message: "Missing userId or planType" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in DB for ID:", userId);
      return res.status(400).json({ message: "User not found!" });
    }
    

    // ✅ Check for existing active subscription
    const existingSub = await Subscribe.findOne({
      userId,
      endDate: { $gte: new Date() }, // active subscription not expired
    });

    if (existingSub) {
      return res.status(400).json({ message: "You already have an active subscription!" });
    }

    // 💰 Plan pricing
    let amount;
    if (planType === "Basic") amount = 149.99;
    else if (planType === "Intermediate") amount = 699.99;
    else if (planType === "Advanced") amount = 1499.99;
    else {
      console.log("Invalid plan type:", planType);
      return res.status(400).json({ message: "Invalid plan type" });
    }

    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay error:", error);
        return res.status(500).json({ message: "Payment initiation failed!" });
      }

      res.status(200).json({ order });
    });
  } catch (error) {
    console.error("Subscribe route error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// 2️⃣ Verify Payment and Save Subscription
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planType } = req.body;

    if (!userId || !planType) {
      return res.status(400).json({ message: "Missing userId or planType" });
    }

    // Signature verification
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature!" });
    }

    // Calculate start and end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Common for all plans

    // Map planType to subTypeId
    const planMap = { Basic: 1, Intermediate: 2, Advanced: 3 };
    const subTypeId = planMap[planType];

    if (!subTypeId) {
      return res.status(400).json({ message: "Invalid plan type!" });
    }

    // Save subscription to main table
    const subscription = await Subscribe.create({
      userId,
      subTypeId,
      startDate,
      endDate,
    });

    // Add entry to corresponding plan table
    if (planType === "Basic") {
      await Basic.create({ id: subscription.subId });
    } else if (planType === "Intermediate") {
      await Intermediate.create({ id: subscription.subId });
    } else if (planType === "Advanced") {
      await Advanced.create({ id: subscription.subId });
    }

    res.status(200).json({ message: "Payment verified and subscription created!" });
  } catch (error) {
    console.error("Verify route error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// // Fetch the active subscription for the logged-in user
// router.get("/active", async (req, res) => {
//   const { userEmail } = req.query;
//   console.log("Fetching active subscription for user:", userEmail);

//   try {
//     const user = await User.findOne({ email: userEmail });
//     console.log("User found:", user);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Now find subscriptions linked to the user
//     const subscriptions = await Subscribe.find({ userId: user._id });
//     console.log("Subscriptions found:", subscriptions);

//     if (subscriptions.length === 0) {
//       console.log("No subscriptions found for user:", userEmail);
//       return res.status(404).json({ message: "No subscriptions found." });
//     }

//     const activeSubscription = subscriptions.sort(
//       (a, b) => new Date(b.endDate) - new Date(a.endDate)
//     )[0];

//     if (new Date(activeSubscription.endDate) > new Date()) {
//       console.log("Active subscription found:", activeSubscription);
//       return res.json(activeSubscription);
//     } else {
//       return res.status(400).json({ message: "Subscription has expired." });
//     }
//   } catch (error) {
//     console.error("Error fetching subscription:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });
router.get("/active", async (req, res) => {
  const { userEmail } = req.query;
  console.log("Fetching active subscription for user:", userEmail);

  try {
    const user = await User.findOne({ email: userEmail });
    // console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const subscriptions = await Subscribe.find({ userId: user._id });
    // console.log("Subscriptions found:", subscriptions);

    if (subscriptions.length === 0) {
      console.log("No subscriptions found for user:", userEmail);
      return res.status(404).json({ message: "No subscriptions found." });
    }

    const activeSubscription = subscriptions.sort(
      (a, b) => new Date(b.endDate) - new Date(a.endDate)
    )[0];

    if (new Date(activeSubscription.endDate) > new Date()) {
      let planType = "";
let limit = 0;

switch (activeSubscription.subTypeId) {
  case 1:
    planType = "Basic";
    const basic = await Basic.findOne({ id: activeSubscription.subId });
    limit = basic?.limit || 30;
    break;
  case 2:
    planType = "Intermediate";
    const intermediate = await Intermediate.findOne({ id: activeSubscription.subId });
    limit = intermediate?.limit || 60;
    break;
  case 3:
    planType = "Advanced";
    const advanced = await Advanced.findOne({ id: activeSubscription.subId });
    limit = advanced?.limit || 90;
    break;
  default:
    planType = "Unknown";
}

      return res.json({
        ...activeSubscription.toObject(),
        planType,
        limit,
      });
    } else {
      return res.status(400).json({ message: "Subscription has expired." });
    }
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post('/decrement-limit', async (req, res) => {
  const { userEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get latest subscription
    const subscriptions = await Subscribe.find({ userId: user._id });
    if (!subscriptions.length)
      return res.status(404).json({ message: 'No subscription found' });

    const activeSubscription = subscriptions.sort(
      (a, b) => new Date(b.endDate) - new Date(a.endDate)
    )[0];

    if (new Date(activeSubscription.endDate) < new Date())
      return res.status(400).json({ message: 'Subscription expired' });

    // Fetch the correct plan based on subTypeId
    let planModel;
    if (activeSubscription.subTypeId === 1) planModel = Basic;
    else if (activeSubscription.subTypeId === 2) planModel = Intermediate;
    else if (activeSubscription.subTypeId === 3) planModel = Advanced;
    else return res.status(400).json({ message: 'Invalid subscription type' });

    // Fetch and update the plan
    const plan = await planModel.findOne({ id: activeSubscription.subId });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    if (plan.limit <= 0)
      return res.status(400).json({ message: 'Usage limit exhausted' });

    plan.limit -= 1;
    await plan.save();
    console.log('Plan limit decremented:', plan.limit);
    return res.json({ message: 'Limit decremented', limit: plan.limit  });

  } catch (error) {
    console.error('Error in decrement-limit:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
