import { v4 as uuidv4 } from "uuid"; // Import UUID generator to create unique file names
import cron from "node-cron"; // Import cron for scheduling tasks
import { createClient } from "@supabase/supabase-js"; // Import Supabase client for interacting with the Supabase API
import Offer from "../model/offers/offer_model.js"; // Assuming you have a model for offers in MongoDB

// Initialize Supabase client with your Supabase credentials
const supabaseUrl = "https://wmrixxnifvpbusxjlydr.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtcml4eG5pZnZwYnVzeGpseWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzQ4NDIzMywiZXhwIjoyMDQ5MDYwMjMzfQ.512eg6433N0UNPRBjtP_iRrUudIZwVFMCkbAUTGDrh4"; // Replace with your Supabase service key
const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase bucket name where files will be uploaded
const bucketName = "dcom";

// Store active cron jobs in memory
const activeCronJobs = {};

export const uploadOffer = async (req, res) => {    
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const { title, description, price, startTime, endTime } = req.body;

    if (!title || !description || !price || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res
        .status(400)
        .json({ message: "Invalid or mismatched start and end times!" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${uuidv4()}-${req.file.originalname}`;
    const storagePath = `offers/${fileName}`;

    // Upload file to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false // Prevent overwriting existing files
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return res
        .status(500)
        .json({ message: "Failed to upload file to Supabase!" });
    }

    // Get the public URL - corrected version
    const publicURL = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;

    // Create and save the offer with the correct file information
    const offer = new Offer({
      title,
      description,
      price,
      filePath: storagePath,
      fileUrl: publicURL,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });

    await offer.save();

    // // Set up deletion cron job
    // const cronJobId = uuidv4();
    // const cronJob = cron.schedule("*/30 * * * *", async () => {
    //   const currentTime = new Date();
    //   if (currentTime >= end) {
    //     try {
    //       await Offer.deleteOne({ _id: offer._id });
          
    //       const { error: deleteError } = await supabase.storage
    //         .from(bucketName)
    //         .remove([storagePath]);

    //       if (deleteError) {
    //         console.error("Error deleting file from Supabase:", deleteError.message);
    //       }

    //       cronJob.stop();
    //       delete activeCronJobs[cronJobId];
    //       console.log(`Deleted offer: ${offer._id}`);
    //     } catch (err) {
    //       console.error("Error during deletion process:", err);
    //     }
    //   }
    // });

    // activeCronJobs[cronJobId] = cronJob;

    res.status(200).json({
      message: "Upload successful",
      fileUrl: publicURL,
      offerId: offer._id,
    });
  } catch (err) {
    console.error("Error during offer upload:", err);
    res.status(500).json({ message: err.message });
  }
};




export const getUploadOffer = async (req, res) => {
  try {
    // Fetch all offers from the database, sorted by creation date (newest first)
    const allOffers = await Offer.find({}).sort({ createdAt: -1 });

    // Check if no offers are found
    if (!allOffers || allOffers.length === 0) {
      return res.status(404).json({
        message: "No offers found",
        imageUrls: [],
      });
    }

    // Extract only the file URLs
    const imageUrls = allOffers.map((offer) => offer.fileUrl);

    // Send successful response with the list of image URLs
    res.status(200).json({
      message: "Successfully retrieved all image URLs",
      imageUrls,
    });
  } catch (error) {
    // Handle any server errors
    console.error("Error in getUploadOffer:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Optional: Add pagination support
export const getUploadOfferPaginated = async (req, res) => {
  try {
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated offers
    const totalOffers = await Offer.countDocuments();
    const allOffers = await Offer.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Check if no offers are found
    if (!allOffers || allOffers.length === 0) {
      return res.status(404).json({
        message: "No offers found",
        offers: []
      });
    }

    // Transform offers
    const formattedOffers = allOffers.map(offer => ({
      imageUrl: offer.fileUrl,
    }));

    // Calculate total pages
    const totalPages = Math.ceil(totalOffers / limit);

    // Send successful response
    res.status(200).json({
      message: "Successfully retrieved offers",
      totalOffers,
      currentPage: page,
      totalPages,
      offers: formattedOffers
    });

  } catch (error) {
    // Handle any server errors
    console.error("Error in getUploadOfferPaginated:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};