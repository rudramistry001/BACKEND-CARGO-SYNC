import csv from 'csv-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import Subcategory from './model/sub_categories_model.js';




class SubcategoryImporter {
    constructor() {
        this.subcategories = new Map();
    }

    async importCSV(filePath) {
        try {
            console.log('Starting CSV import process...');
            await this.readAndGroupData(filePath);
            await this.importToMongoDB();
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    }

    async readAndGroupData(filePath) {
        console.log('Reading CSV file and grouping data...');
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const subcategoryName = row['Subcategory Name'];
                    const categoryId = row['CategoryID'];

                    if (!subcategoryName || !categoryId) {
                        console.warn('Missing required fields in row:', row);
                        return;
                    }

                    if (!this.subcategories.has(subcategoryName)) {
                        this.subcategories.set(subcategoryName, {
                            name: subcategoryName,
                            description: row.Description || '',
                            CategoryID: categoryId,
                            attributes: []
                        });
                    }

                    const attribute = {
                        name: row['Attribute Name'],
                        type: row['Attribute Type'].toLowerCase(),
                        required: row.Required?.toLowerCase() === 'true'
                    };

                    if (attribute.name && !this.subcategories.get(subcategoryName).attributes
                        .find(attr => attr.name === attribute.name)) {
                        this.subcategories.get(subcategoryName).attributes.push(attribute);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });
    }

    async importToMongoDB() {
        console.log('Starting MongoDB import...');
        for (const [name, data] of this.subcategories) {
            try {
                // Verify category exists
                const category = await Category.findById(data.CategoryID);
                if (!category) {
                    console.warn(`Skipping ${name}: Category ${data.CategoryID} not found`);
                    continue;
                }

                // Convert CategoryID to ObjectId
                data.CategoryID = new mongoose.Types.ObjectId(data.CategoryID);

                // Create or update subcategory
                const existingSubcategory = await Subcategory.findOne({ name });
                if (existingSubcategory) {
                    await Subcategory.findOneAndUpdate(
                        { name },
                        { $set: data },
                        { new: true }
                    );
                    console.log(`Updated subcategory: ${name}`);
                } else {
                    const subcategory = new Subcategory(data);
                    await subcategory.save();
                    console.log(`Created subcategory: ${name}`);
                }
            } catch (error) {
                console.error(`Error processing ${name}:`, error);
            }
        }
    }
}

// Usage
async function runImport() {
    try {
        await mongoose.connect('mongodb+srv://rudramistry74:nkmgAxfF8HodvXdb@dcomdb.ysjcz.mongodb.net/?retryWrites=true&w=majority&appName=DComDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const importer = new SubcategoryImporter();
        await importer.importCSV("E:/RUDRA MISTRY/BACKEND-D_COM/sub-cat.csv");
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

export default Subcategory;
export { SubcategoryImporter, runImport };
