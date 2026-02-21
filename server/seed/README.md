# Seed Data Documentation

This folder contains JSON seed data for the ShopSmart e-commerce database.

## Files

- `categories.json` - 6 product categories
- `products.json` - 22 products across all categories (Note: You need to replace `categoryName` with actual `category` ObjectId after importing categories)
- `users.json` - 3 test users with pre-hashed passwords

## Default Login Credentials

All users have the password: `password123`

| Email | Role |
|-------|------|
| john@example.com | user |
| jane@example.com | user |
| admin@shopsmart.com | admin |

## How to Import Data

### Option 1: MongoDB Compass (GUI)

1. Open MongoDB Compass and connect to your database
2. Create a database called `shopsmart`
3. Import each collection:
   - Click "Add Data" → "Import JSON"
   - Select the corresponding JSON file
   - For `products.json`, you'll need to manually update category references after importing

### Option 2: MongoDB CLI

```bash
# Import categories
mongoimport --db shopsmart --collection categories --file seed/categories.json --jsonArray

# Import users
mongoimport --db shopsmart --collection users --file seed/users.json --jsonArray

# Import products (after updating category ObjectIds)
mongoimport --db shopsmart --collection products --file seed/products.json --jsonArray
```

### Option 3: Programmatic Seeding

Run the seed script (if available):
```bash
npm run seed
```

## Notes

- Products reference categories by `categoryName` - you'll need to update these to actual MongoDB ObjectIds after importing categories
- User passwords are pre-hashed using bcrypt (the original password is `password123`)
- All prices are in Indian Rupees (₹)
