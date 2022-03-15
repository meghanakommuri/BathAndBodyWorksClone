# BathAndBodyWorksClone

PROJECT DESCRIPTION:

This website is for purchasing bath and body products. The products are divided into three categories:
- Bath & Shower
- Moisturizers
- Fragrance

There are 2 types of users in this system: Normal user and Admin user

Normal User: User can perform the following actions

1. Register: User can register to the site by entering details like name, email, phone number and password.
2. Login: Using the email and password user can login into the website
3. Order Items: User can add items to the cart and place order
4. User History: User can view their order history in the profile page along with their name, email and contact number. 

Admin User: Admin can perform the following actions

1. Add a new product: Admin can enter details of a new product to add it to the website.
2. Update an existing product: Admin can edit the existing product and update its details.
3. Delete a product: Admin can delete a product, the deleted product will not be visible on the website. We have used a soft delete for it.

Furthermore, on the products page search and filter are implemented. We can search the products based on name or type of product. 

Pagination is implemented and combined with search as well.

DATABASE DESIGN:

We have used MongoDB as the database. We have created 4 collections: Account, Product, Cart and Order.

ACCOUNT COLLECTION:
The user collection stores the user information when they register.

![image](https://user-images.githubusercontent.com/52080417/158381398-cdd45c99-27da-4ee5-a10b-56bc237bb947.png)

PRODUCT COLLECTION:
This collection stores the products information

![image](https://user-images.githubusercontent.com/52080417/158381503-77b3a582-4134-45e6-bd07-baaf7a1eb8fc.png)

CART COLLECTION:
This collection stores the items that user adds to their cart. It is specific to the user.
When the user checkouts the items, those items are removed from his cart collection.

![image](https://user-images.githubusercontent.com/52080417/158381542-93210fad-77f2-4b73-bd3d-cf573dbeceb2.png)

ORDER COLLECTION:
This collection stores the order items after the user checkouts. It maintains the order history for a user. 

![image](https://user-images.githubusercontent.com/52080417/158381582-ebf38e57-d510-40a9-8126-5892a035aed8.png)
