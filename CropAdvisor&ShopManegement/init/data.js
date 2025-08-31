module.exports = {
  customers: [
    {
      name: "Ramesh Patel",
      phone: "+919876543210",
      email: "ramesh@example.com",
      address: "123 Farm Road, Ludhiana"
    },
    {
      name: "Suresh Kumar",
      phone: "+919876543211",
      email: "suresh@example.com",
      address: "456 Agri Lane, Pune"
    },
    {
      name: "Manoj Sharma",
      phone: "+919876543212",
      email: "manoj@example.com",
      address: "789 Crop Street, Chennai"
    },
    {
      name: "Priya Verma",
      phone: "+919812345678",
      email: "priya@example.com",
      address: "101 Harvest Blvd, Nagpur"
    },
    {
      name: "Anil Joshi",
      phone: "+919834567890",
      email: "anil@example.com",
      address: "305 Field Avenue, Jaipur"
    }
  ],

  products: [
    {
      name: "Urea Granules",
      description: "High-quality urea granules for optimal crop growth.",
      image: {
        filename: "urea_granules",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Urea_granules.jpg"
      },
      price: 250
    },
    {
      name: "DAP Fertilizer",
      description: "Diammonium phosphate fertilizer for enhanced root development.",
      image: {
        filename: "dap_fertilizer",
        url: "https://5.imimg.com/data5/SELLER/Default/2022/10/AD/OO/HU/163538405/dap-fertilizer-500x500.jpg"
      },
      price: 1200
    },
    {
      name: "Organic Compost",
      description: "Natural compost for sustainable farming.",
      image: {
        filename: "organic_compost",
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Compost_bin_full_of_compost.jpg"
      },
      price: 400
    },
    {
      name: "Potash Fertilizer",
      description: "Helps improve drought resistance in crops.",
      image: {
        filename: "potash_fertilizer",
        url: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Potash_sample.jpg"
      },
      price: 850
    },
    {
      name: "Bio Fertilizer",
      description: "Eco-friendly and improves soil health.",
      image: {
        filename: "bio_fertilizer",
        url: "https://www.agrifarming.in/wp-content/uploads/2019/03/Biofertilizer.jpg"
      },
      price: 500
    },
    {
      name: "Private Island Retreat",
      description: "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 10000
    },
    // ---- Additional Products Below ----
    {
      name: "Ammonium Nitrate",
      description: "Granular nitrogen fertilizer providing quick-release nitrogen for rapid plant growth. Suitable for specialty crops and pastures.",
      image: {
        filename: "ammonium_nitrate",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Ammonium_nitrate.jpg"
      },
      price: 900
    },
    {
      name: "Triple Super Phosphate (TSP)",
      description: "Highly concentrated phosphorus fertilizer (44-48% P₂O₅) for strong root and flower development, ideal for early crop stages.",
      image: {
        filename: "triple_super_phosphate",
        url: "https://5.imimg.com/data5/SELLER/Default/2022/12/RI/JA/IG/14530446/triple-super-phosphate-fertilizer-500x500.jpg"
      },
      price: 1100
    },
    {
      name: "Potassium Nitrate",
      description: "Water-soluble fertilizer rich in potassium and nitrogen, promotes fruiting and flowering in vegetables and fruit crops.",
      image: {
        filename: "potassium_nitrate",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Potassium_nitrate.jpg"
      },
      price: 1500
    },
    {
      name: "Calcium Nitrate",
      description: "Source of soluble calcium and nitrogen, improves fruit quality and shelf life. Used in foliar and drip irrigation.",
      image: {
        filename: "calcium_nitrate",
        url: "https://5.imimg.com/data5/SELLER/Default/2022/10/KB/FS/GL/1531677/calcium-nitrate-fertilizer-500x500.jpg"
      },
      price: 1300
    },
    {
      name: "Single Super Phosphate (SSP)",
      description: "Phosphorus-rich fertilizer (14-18% P₂O₅) for root development, often used as a basal dose in various crops.",
      image: {
        filename: "single_super_phosphate",
        url: "https://5.imimg.com/data5/SELLER/Default/2021/3/UZ/AX/TV/12589603/single-super-phosphate-ssp-fertilizer-500x500.jpg"
      },
      price: 700
    },
    {
      name: "Vermicompost",
      description: "Organic fertilizer produced by earthworms, enhances soil fertility and microbial activity for sustainable farming.",
      image: {
        filename: "vermicompost",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Vermicompost.jpg"
      },
      price: 350
    },
    {
      name: "Sulphate of Potash (SOP)",
      description: "Chloride-free potassium fertilizer, ideal for sensitive crops like fruits and vegetables, improves yield and quality.",
      image: {
        filename: "sulphate_of_potash",
        url: "https://5.imimg.com/data5/SELLER/Default/2021/7/KT/ZX/TF/1267231/sulphate-of-potash-500x500.jpg"
      },
      price: 1800
    },
    {
      name: "NPK 20-20-20",
      description: "Balanced water-soluble fertilizer for all-round plant nutrition, suitable for foliar spray and drip irrigation.",
      image: {
        filename: "npk_20_20_20",
        url: "https://5.imimg.com/data5/SELLER/Default/2021/6/NN/MB/II/1267231/npk-20-20-20-water-soluble-fertilizer-500x500.jpg"
      },
      price: 950
    }
  ],

  workers: [
    {
      name: "Amit Singh",
      role: "Warehouse Manager",
      age: 35,
      salary: 25000,
      contact: "+919876543213"
    },
    {
      name: "Sumit Singh",
      role: "Store Assistant",
      age: 28,
      salary: 20000,
      contact: "+919806543213"
    },
    {
      name: "Rekha Das",
      role: "Quality Inspector",
      age: 32,
      salary: 22000,
      contact: "+919835241234"
    },
    {
      name: "Rajesh Yadav",
      role: "Delivery Head",
      age: 40,
      salary: 27000,
      contact: "+919812345555"
    }
  ],

  getStocks: function(products) {
    return [
      {
        product: products[0]._id, // Urea Granules
        quantity: 100
      },
      {
        product: products[1]._id, // DAP Fertilizer
        quantity: 150
      },
      {
        product: products[2]._id, // Organic Compost
        quantity: 50
      },
      {
        product: products[3]._id, // Potash Fertilizer
        quantity: 80
      },
      {
        product: products[4]._id, // Bio Fertilizer
        quantity: 70
      }
    ];
  },

  getPayments: function(customers, products) {
  return [
    {
      customer: customers[0]._id,
      product: products[0]._id, // Urea (₹250)
      quantity: 2,
      totalAmount: 250 * 2,
      amountPaid: 500,
      paymentStatus: "Paid"
    },
    {
      customer: customers[1]._id,
      product: products[1]._id, // DAP (₹1200)
      quantity: 1,
      totalAmount: 1200,
      amountPaid: 600,
      paymentStatus: "Partial"
    },
    {
      customer: customers[2]._id,
      product: products[2]._id, // Compost (₹400)
      quantity: 1,
      totalAmount: 400,
      amountPaid: 0,
      paymentStatus: "Due"
    },
    {
      customer: customers[3]._id,
      product: products[3]._id, // Potash (₹850)
      quantity: 2,
      totalAmount: 1700,
      amountPaid: 850,
      paymentStatus: "Partial"
    },
    {
      customer: customers[4]._id,
      product: products[4]._id, // Bio Fertilizer (₹500)
      quantity: 1,
      totalAmount: 500,
      amountPaid: 500,
      paymentStatus: "Paid"
    }
  ];
}
};