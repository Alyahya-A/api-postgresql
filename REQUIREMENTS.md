# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

- Index `GET /products/`
- Show `GET /products/:id`
- Create `POST /products/`
- Delete `DELETE /products/:id`

### Token

- Generate `POST /token/`

### Status

- Index `GET /status/`
- Show `GET /status/:id`
- Create `POST /status/`
- Delete `DELETE /status/:id`
- Category's Products `GET /categories/:categoryId/products`

### Categories

- Index `GET /categories/`
- Show `GET /categories/:id`
- Create `POST /categories/`
- Delete `DELETE /categories/:id`

### Users

- Index `GET /users/`
- Show `GET /users/:id`
- Create `POST /users/`
- Delete `DELETE /users/:id`

### Orders

- Index `GET /orders/`
- Show `GET /orders/:id`
- Create `POST /orders/`
- Delete `DELETE /orders/:id`
- Active Order by current user `GET /orders/active`
- Completed Orders by current user `GET /orders/completed`
- Add Items to Order `POST /orders/:orderId/products`
- Complete Order `PUT /orders/:orderId/complete`

## Data Shapes

### Product

| Column      | Type                   | Collation | Nullable | Default                             |
| ----------- | ---------------------- | --------- | -------- | ----------------------------------- |
| id          | integer                |           | not null | nextval('product_id_seq'::regclass) |
| name        | character varying(150) |           | not null |                                     |
| price       | numeric(7,2)           |           | not null |                                     |
| category_id | integer                |           |          |                                     |

#### Indexes:

    "product_pkey" PRIMARY KEY, btree (id)

#### Foreign-key constraints:

    "fk_category" FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE ON DELETE SET NULL

#### Referenced by:

    TABLE "order_item" CONSTRAINT "fk_product" FOREIGN KEY (product_id) REFERENCES product(id) ON UPDATE CASCADE

---

### LK_Status

| Column | Type                   | Collation | Nullable | Default                               |
| ------ | ---------------------- | --------- | -------- | ------------------------------------- |
| id     | integer                |           | not null | nextval('lk_status_id_seq'::regclass) |
| code   | integer                |           | not null |                                       |
| name   | character varying(100) |           | not null |                                       |

#### Indexes:

    "lk_status_pkey" PRIMARY KEY, btree (id)

#### Referenced by:

    TABLE "orders" CONSTRAINT "fk_status" FOREIGN KEY (status_id) REFERENCES lk_status(id) ON UPDATE CASCADE ON DELETE SET NULL

---

### Category

| Column      | Type                   | Collation | Nullable | Default                              |
| ----------- | ---------------------- | --------- | -------- | ------------------------------------ |
| id          | integer                |           | not null | nextval('category_id_seq'::regclass) |
| name        | character varying(100) |           | not null |                                      |
| description | character varying(500) |           |          |                                      |

#### Indexes:

    "category_pkey" PRIMARY KEY, btree (id)

#### Referenced by:

    TABLE "product" CONSTRAINT "fk_category" FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE ON DELETE SET NULL

---

### Users

| Column           | Type                   | Collation | Nullable | Default                           |
| ---------------- | ---------------------- | --------- | -------- | --------------------------------- |
| id               | integer                |           | not null | nextval('users_id_seq'::regclass) |
| firstname        | character varying(30)  |           | not null |                                   |
| lastname         | character varying(30)  |           | not null |                                   |
| email            | text                   |           | not null |                                   |
| password_encrypt | character varying(150) |           | not null |                                   |

#### Indexes:

    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)

#### Referenced by:

    TABLE "orders" CONSTRAINT "fk_users" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

---

### Orders

| Column    | Type    | Collation | Nullable | Default                            |
| --------- | ------- | --------- | -------- | ---------------------------------- |
| id        | integer |           | not null | nextval('orders_id_seq'::regclass) |
| user_id   | integer |           |          |                                    |
| status_id | integer |           |          |                                    |

#### Indexes:

    "orders_pkey" PRIMARY KEY, btree (id)

#### Foreign-key constraints:

    "fk_status" FOREIGN KEY (status_id) REFERENCES lk_status(id) ON UPDATE CASCADE ON DELETE SET NULL
    "fk_users" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

#### Referenced by:

    TABLE "order_item" CONSTRAINT "fk_order" FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE

---

### Order_item

| Column     | Type    | Collation | Nullable | Default                                |
| ---------- | ------- | --------- | -------- | -------------------------------------- |
| id         | integer |           | not null | nextval('order_item_id_seq'::regclass) |
| order_id   | integer |           |          |                                        |
| product_id | integer |           |          |                                        |
| quantity   | integer |           | not null |                                        |

#### Indexes:

    "order_item_pkey" PRIMARY KEY, btree (id)

#### Foreign-key constraints:

    "fk_order" FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE
    "fk_product" FOREIGN KEY (product_id) REFERENCES product(id) ON UPDATE CASCADE
